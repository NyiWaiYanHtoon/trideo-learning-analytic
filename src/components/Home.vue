<script setup lang="ts">
import { ref } from 'vue';
import SimplePaginition from './SimplePaginition.vue';

const videos = [
  {
    id: 1,
    url: 'video1.mp4',
    title: 'First Video',
    description: 'This is the first video.'
  },
  {
    id: 2,
    url: 'video2.mp4',
    title: 'Second Video',
    description: 'This is the second video.'
  },
  {
    id: 3,
    url: 'video3.mp4',
    title: 'Third Video',
    description: 'This is the third video.'
  },
  {
    id: 4,
    url: 'video3.mp4',
    title: 'Fourth Video',
    description: 'This is another video.'
  },
  {
    id: 5,
    url: 'video3.mp4',
    title: 'Fifth Video',
    description: 'Another interesting video.'
  },
  {
    id: 6,
    url: 'video3.mp4',
    title: 'Sixth Video',
    description: 'Informative content here.'
  },
  {
    id: 7,
    url: 'video3.mp4',
    title: 'Seventh Video',
    description: 'Keep watching more content.'
  },
  {
    id: 8,
    url: 'video4.mp4',
    title: 'Eighth Video',
    description: 'Final video in the list.'
  },
  {
    id: 5,
    url: 'video3.mp4',
    title: 'Fifth Video',
    description: 'Another interesting video.'
  },
  {
    id: 6,
    url: 'video3.mp4',
    title: 'Sixth Video',
    description: 'Informative content here.'
  },
  {
    id: 7,
    url: 'video3.mp4',
    title: 'Seventh Video',
    description: 'Keep watching more content.'
  },
  {
    id: 8,
    url: 'video4.mp4',
    title: 'Eighth Video',
    description: 'Final video in the list.'
  }
];

 const page= ref(1);
 const setPage= (newPage: number)=>{
  page.value=  newPage;
 }

</script>
<template>
  <!-- Video Grid -->
  <div class="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-6 py-5">
    <router-link
      v-for="video in videos"
      :key="video.id"
      :to="{ name: 'Video', params: { id: video.id } }"
      class="group rounded-xs overflow-hidden border border-[#333] bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-all shadow hover:shadow-md hover:-translate-y-1"
    >
      <!-- Thumbnail -->
      <div class="aspect-video bg-black overflow-hidden">
        <img
          src="/images/example_thumbnail.png"
          alt="Video thumbnail"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <!-- Content -->
      <div class="p-2">
        <h3 class="text-base font-semibold text-white group-hover:text-blue-400 truncate">
          {{ video.title }}
        </h3>
        <p class="text-sm text-gray-400 mt-1 line-clamp-2">
          {{ video.description }}
        </p>
      </div>
    </router-link>
  </div>

  <!-- Pagination -->
  <div class="flex justify-center my-2">
    <SimplePaginition
      :page="page"
      :setPage="setPage"
      :disableBack="page <= 1"
      :disableForward="page >= 5"
      :isDark="false"
    />
  </div>
</template>

