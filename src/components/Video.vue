<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import VideoPlayer from './VideoPlayer.vue'
import { ThumbsUp, ThumbsDown, CalendarDays, Clock, Eye, Tag, Folder } from 'lucide-vue-next'

const route = useRoute()
const videoId = route.params.id

const selectedVideo = ref({
  url: 'video1.mp4',
  title: 'Introduction to Vue 3',
  description:
    'This video gives a comprehensive overview of Vue 3, including Composition API, reactivity, and practical examples.',
  author: 'Jane Smith',
  uploadedAt: '2024-07-01',
  views: 1532,
  duration: '12:35',
  likes: 120,
  dislikes: 3,
  tags: ['Vue 3', 'Composition API', 'Frontend'],
  category: 'Web Development',
})
</script>
<template>
    <div class="grid gap-10 md:grid-cols-[1fr_5fr] items-start px-20 py-15 h-[90vh]">
      <aside class="space-y-6 pt-5">
        <!-- Title -->
        <h1 class="text-xl font-bold text-gray-900 leading-tight">
          {{ selectedVideo.title }}
        </h1>
        <!-- Author -->
        <p class="text-xs text-gray-500">By {{ selectedVideo.author }}</p>

        <!-- Metadata items -->
        <ul class="space-y-3 text-sm text-gray-700">
          <li class="flex items-center gap-2">
            <CalendarDays class="w-4 h-4 text-gray-500" />
            <span>{{ selectedVideo.uploadedAt }}</span>
          </li>
          <li class="flex items-center gap-2">
            <Clock class="w-4 h-4 text-gray-500" />
            <span>{{ selectedVideo.duration }}</span>
          </li>
          <li class="flex items-center gap-2">
            <Eye class="w-4 h-4 text-gray-500" />
            <span>{{ selectedVideo.views.toLocaleString() }} views</span>
          </li>
        </ul>

        <!-- Likes/Dislikes -->
        <div class="flex items-center gap-4 text-sm">
          <div class="flex items-center gap-1 text-green-600">
            <ThumbsUp class="w-4 h-4" />
            {{ selectedVideo.likes }}
          </div>
          <div class="flex items-center gap-1 text-red-500">
            <ThumbsDown class="w-4 h-4" />
            {{ selectedVideo.dislikes }}
          </div>
        </div>

        <!-- Category -->
        <div class="flex items-center gap-2 text-sm text-gray-700 pt-2">
          <Folder class="w-4 h-4 text-gray-500" />
          <span class="font-medium">{{ selectedVideo.category }}</span>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1 pt-2">
          <span
            v-for="tag in selectedVideo.tags"
            :key="tag"
            class="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
          >
            <Tag class="w-3 h-3 mr-1 text-gray-400" />
            {{ tag }}
          </span>
        </div>
      </aside>

      <section>
        <VideoPlayer :video="selectedVideo" />
      </section>
    </div>
</template>
