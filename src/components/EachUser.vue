<script setup lang="ts">
import {
  DrawerContent,
} from "@/components/shadcn/drawer";
import { Badge } from "@/components/shadcn/badge";
import { computed, ref, watchEffect } from "vue";
import { formatDate } from "date-fns";
import SimplePaginition from "@/components/SimplePaginition.vue";
import { useRouter } from "vue-router";

interface User {
  id: string;
  email: string;
  joinedAt: string;
  mostViewedCategory?: { name: string };
  mostVisitedCategory?: { name: string };
  mostViewedVideo?: { id:string, thumbnailUrl?: string; title?: string };
  mostVisitedVideo?: { id: string, thumbnailUrl?: string; title?: string };
}

type Stats = {
  visits: number;
  views: number;
  completions: number;
  totalVideoCount: number;
};

type Video = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: Date;
  duration: number;
  category: { name: string };
  likes: { id: string; users: string[]; count: number; videoId: string } | null;
  dislikes: { id: string; users: string[]; count: number; videoId: string } | null;
  views: number;
  completes: number;
  visits: number;
};

const props = defineProps<{
  selectedUser: User;
}>();

const router= useRouter();

// stats
const stats = ref<Stats | null>(null);

// videos pagination
const page = ref(1);
const pageSize = 4;
const videos = ref<Video[]>([]);
const total = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);

watchEffect(async () => {
  if (!props.selectedUser?.id) return;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/stats/overall`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timeframe: "all", userId: props.selectedUser.id }),
      }
    );

    if (!res.ok) throw new Error("Failed to fetch stats");
    const data: Stats = await res.json();
    stats.value = data || { visits: 0, views: 0, completions: 0, totalVideoCount: 0 };
  } catch (err) {
    console.error("Failed to fetch stats:", err);
  }
});

// fetch paginated videos
watchEffect(async () => {
  if (!props.selectedUser?.id) return;
  loading.value = true;
  error.value = null;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/videos?page=${page.value}&pageSize=${pageSize}&userId=${props.selectedUser.id}`,
      { method: "GET" }
    );

    if (!res.ok) throw new Error("Failed to fetch completed videos");

    const data: { videos: Video[]; total: number } | null = await res.json();
    if (data) {
      videos.value = data.videos;
      total.value = data.total;
    } else {
      videos.value = [];
      total.value = 0;
    }
  } catch (err: any) {
    console.error("Fetch videos failed:", err);
    error.value = err.message || "Something went wrong.";
    videos.value = [];
  } finally {
    loading.value = false;
  }
});

// computed rates
const viewRate = computed(() =>
  stats.value && stats.value.visits
    ? ((stats.value.views / stats.value.visits) * 100).toFixed(1)
    : "0.0"
);

const completionRate = computed(() =>
  stats.value && stats.value.views
    ? ((stats.value.completions / stats.value.views) * 100).toFixed(1)
    : "0.0"
);
</script>

<template>
  <DrawerContent
    v-if="selectedUser"
    class="w-full max-w-full h-full flex flex-col bg-gray-900"
  >
    <div class="flex flex-1 overflow-hidden">
      <!-- Left panel -->
      <aside class="w-1/4 p-6 overflow-y-auto flex-shrink-0 rounded-l-lg">
        <h3 class="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
          Profile
        </h3>
        <p class="mb-2">
          <strong>User email:</strong> {{ selectedUser.email }}
        </p>
        <p>
          <strong>Joined at:</strong>
          {{ formatDate(selectedUser.joinedAt, "yyyy MMMM dd") }}
        </p>
      </aside>

      <!-- Main panel -->
      <div
        class="flex-1 p-6 space-y-8 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <!-- Stats -->
        <section v-if="!!stats">
          <h3 class="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
            Stats
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="stat in [
                { title: 'Total videos in the system', value: stats.totalVideoCount },
                { title: 'Visited', value: stats.visits },
                { title: 'Viewed', value: stats.views },
                { title: 'Completed', value: stats.completions },
                { title: 'View Rate', value: viewRate + '%' },
                { title: 'Completion Rate', value: completionRate + '%' }
              ]"
              :key="stat.title"
              class="p-4 rounded-lg bg-gray-800 border border-gray-700 shadow-sm"
            >
              <p class="text-sm text-gray-400">{{ stat.title }}</p>
              <p class="text-xl font-bold">{{ stat.value }}</p>
            </div>
          </div>
        </section>

        <!-- Highlights -->
        <section>
          <h3 class="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
            Highlights
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <!-- Categories -->
            <div class="flex flex-col gap-y-3 pt-10">
              <Badge
                class="py-1 bg-purple-100 text-purple-800 text-center rounded-full w-full"
              >
                Most viewed category:
                {{ selectedUser.mostViewedCategory?.name || "-" }}
              </Badge>
              <Badge
                class="py-1 bg-purple-100 text-purple-800 text-center rounded-full w-full"
              >
                Most visited category:
                {{ selectedUser.mostVisitedCategory?.name || "-" }}
              </Badge>
            </div>

            <!-- Most Visited Video -->
            <div class="flex flex-col gap-2 min-w-[250px] cursor-pointer" @click="router.push(`/video/${selectedUser.mostVisitedVideo?.id}`)">
              <span class="font-medium mb-2">Most Visited Video</span>
              <div
                v-if="selectedUser.mostVisitedVideo"
                class="flex items-center gap-3"
              >
                <img
                  :src="selectedUser.mostVisitedVideo.thumbnailUrl || '/images/placeholder.png'"
                  alt="video thumb"
                  class="w-24 h-16 object-cover rounded border border-gray-700"
                />
                <span class="truncate">{{ selectedUser.mostVisitedVideo.title }}</span>
              </div>
              <p v-else class="text-gray-400">-</p>
            </div>

            <!-- Most Viewed Video -->
            <div class="flex flex-col gap-2 min-w-[250px] cursor-pointer"  @click="router.push(`/video/${selectedUser.mostViewedVideo?.id}`)">
              <span class="font-medium mb-2">Most Viewed Video</span>
              <div
                v-if="selectedUser.mostViewedVideo"
                class="flex items-center gap-3"
              >
                <img
                  :src="selectedUser.mostViewedVideo.thumbnailUrl || '/images/placeholder.png'"
                  alt="video thumb"
                  class="w-24 h-16 object-cover rounded border border-gray-700"
                />
                <span class="truncate">{{ selectedUser.mostViewedVideo.title }}</span>
              </div>
              <p v-else class="text-gray-400">-</p>
            </div>
          </div>
        </section>

        <!-- Completed Videos -->
        <div>
          <h3 class="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
            Completed Videos
          </h3>

          <div v-if="loading" class="text-center text-purple-400 animate-pulse">
            Loading...
          </div>
          <div v-else-if="error" class="text-center text-red-400">
            {{ error }}
          </div>
          <div
            v-else-if="videos.length === 0"
            class="text-center text-gray-400"
          >
            No completed videos found.
          </div>
          <div
            v-else
            class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <div
              v-for="video in videos"
              :key="video.id"
              class="bg-gray-800 border border-gray-700 flex flex-col hover:scale-105 transition-transform cursor-pointer"
              @click="router.push(`/video/${video.id}`)"
            >
              <img
                :src="video.thumbnailUrl || '/images/placeholder.png'"
                alt="video thumb"
                class="w-full h-28 object-cover mb-2"
              />
              <Strong class="text-sm line-clamp-2 m-3">{{ video.title }}</strong>
            </div>
          </div>
          <!-- Pagination -->
          <div
            class="flex justify-center my-8"
            v-if="!loading && !error"
          >
            <SimplePaginition
              :page="page"
              :setPage="(p: number) => (page = p)"
              :disableBack="page <= 1"
              :disableForward="page >= Math.ceil(total / pageSize)"
            />
          </div>
        </div>
      </div>
    </div>
  </DrawerContent>
</template>
