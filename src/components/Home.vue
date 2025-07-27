<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import SimplePaginition from './SimplePaginition.vue';
import DebounceSearch from './DebounceSearch.vue';
import { produceToKafka } from '@/utils/produce-kafka-topic';
import { useRouter } from 'vue-router';

const router = useRouter();
const videos = ref<any[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = 12;
const search = ref('');
const loading = ref(false);
const error = ref('');

const fetchVideos = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await fetch(
      `${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/videos?page=${page.value}&search=${search.value}`,
      { method: 'GET' }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch videos. Status: ${res.status}`);
    }

    const data = await res.json();
    videos.value = data.videos;
    total.value = data.total;
  } catch (err: any) {
    console.error('Failed to fetch videos:', err);
    error.value = 'Something went wrong while loading videos. Please try again.';
    videos.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchVideos);
watch(page, fetchVideos);
watch(search, () => {
  page.value = 1;
  fetchVideos();
});

const setPage = (newPage: number) => {
  page.value = newPage;
};

const handleClick = async (videoId: string) => {
  await produceToKafka('video-visit', videoId);
  router.push({ name: 'Video', params: { id: videoId } });
};
</script>

<template>
  <!-- Search -->
  <DebounceSearch v-model:search="search" placeholder="Search videos..." />

  <!-- Skeleton Loader -->
  <div
    v-if="loading"
    class="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-6 py-5"
  >
    <div
      v-for="n in pageSize"
      :key="n"
      class="rounded-xl bg-gray-800 shadow-inner animate-pulse"
    >
      <div class="aspect-video bg-gray-700 rounded-t-xl"></div>
      <div class="p-4 space-y-3">
        <div class="h-4 bg-gray-600 rounded w-3/4"></div>
        <div class="h-3 bg-gray-600 rounded w-full"></div>
        <div class="h-3 bg-gray-600 rounded w-5/6"></div>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-if="error && !loading" class="text-center text-red-400 mt-10">
    {{ error }}
  </div>

  <!-- Video Grid -->
  <div
    v-else-if="videos.length"
    class="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-6 py-5"
  >
    <router-link
      v-for="video in videos"
      :key="video.id"
      :to="{ name: 'Video', params: { id: video.id } }"
      @click="handleClick(video.id)"
      class="group overflow-hidden bg-gray-800 hover:bg-gray-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
    >
      <div class="aspect-video bg-black overflow-hidden">
        <img
          :src="video.thumbnailUrl || '/images/example_thumbnail.png'"
          alt="Video thumbnail"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div class="p-4">
        <h3 class="text-base font-semibold text-white group-hover:text-purple-400 truncate">
          {{ video.title }}
        </h3>
        <p class="text-sm text-gray-400 mt-1 line-clamp-2">
          {{ video.description }}
        </p>
      </div>
    </router-link>
  </div>

  <!-- Empty State -->
  <div v-else-if="!loading && !error" class="text-center text-gray-400 mt-6">
    No videos found.
  </div>

  <!-- Pagination -->
  <div
    class="flex justify-center my-8"
    v-if="total > pageSize && !loading && !error"
  >
    <SimplePaginition
      :page="page"
      :setPage="setPage"
      :disableBack="page <= 1"
      :disableForward="page >= Math.ceil(total / pageSize)"
      :isDark="true"
    />
  </div>
</template>

