<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VideoPlayer from './VideoPlayer.vue'
import {
  ThumbsUp,
  ThumbsDown,
  CalendarDays,
  Clock,
  Eye,
  Tag,
  Folder,
  Trash2,
  CheckCircle,
  Navigation
} from 'lucide-vue-next'
import { format } from 'date-fns'
import { getUser, type TUser } from '@/utils/get-user'

interface Video {
  id: string;
  title: string;
  description: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: Date;
  duration: number;
  category: { name: string };
  likes: { id: string, count: number; users: string[], videoId: string } | null;
  dislikes: { id: string, count: number; users: string[], videoId: string } | null;
  views: number;
  visits: number;
  completes: number;
}

const route = useRoute()
const router = useRouter()
const videoId = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id || ''
const selectedVideo = ref<Video | null>(null)
const isLoading = ref(false)
const isError = ref(false)
const user = ref<TUser | null>(null)

const fetchUserAndVideo = async () => {
  const data = await getUser()
  user.value = data

  if (!videoId) return

  isLoading.value = true
  isError.value = false

  try {
    const res = await fetch(`${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/videos?id=${videoId}`)
    if (res.ok) {
      const data = await res.json()
      selectedVideo.value = data.videos?.[0] || null
      if (!selectedVideo.value) isError.value = true
    } else {
      isError.value = true
    }
  } catch (error) {
    console.error(error)
    isError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchUserAndVideo)

const formattedDuration = computed(() => {
  if (!selectedVideo.value?.duration) return 'Unknown'
  const totalSeconds = Math.floor(selectedVideo.value.duration)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const parts = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0 || hours > 0) parts.push(`${minutes}m`)
  parts.push(`${seconds}s`)
  return parts.join(' ')
})

const userLiked = computed(() =>
  user.value && selectedVideo.value?.likes
    ? selectedVideo.value.likes.users.includes(user.value.dbUser.id)
    : false
)

const userDisliked = computed(() =>
  user.value && selectedVideo.value?.dislikes
    ? selectedVideo.value.dislikes.users.includes(user.value.dbUser.id)
    : false
)

const handleLike = async () => {
  if (!user.value || !selectedVideo.value) return
  const userId = user.value.dbUser.id;
  const videoId = selectedVideo.value.id;
  try {
    const res = await fetch(`${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, userId}),
    })
    const data = await res.json()
    if (res.ok && data.data) return selectedVideo.value.likes = data.data
  } catch (error) {
    console.error('Error liking video:', error)
  }
}

const handleDislike = async () => {
  if (!user.value || !selectedVideo.value) return
  const userId = user.value.dbUser.id;
  const videoId = selectedVideo.value.id;
  
  try {
    const res = await fetch(`${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/dislike`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, userId: user.value.dbUser.id }),
    })
    const data = await res.json()
    if (res.ok && data.data) selectedVideo.value.dislikes = data.data
  } catch (error) {
    console.error('Error disliking video:', error)
  }
}

const handleDelete = async () => {
  if (!selectedVideo.value) return;
  try {
    const res = await fetch(`${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/videos/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId: selectedVideo.value?.id })
    })
    if (res.ok) {
      router.push('/home')
    } else {
      console.log('Failed to delete video')
    }
  } catch (error) {
    console.log('Error deleting video:', error)
  }
}
</script>

<template>
  <div v-if="!isLoading && !isError && selectedVideo"
    class="grid gap-10 md:grid-cols-[1fr_5fr] items-start px-4 sm:px-10 py-12 min-h-screen bg-gray-950 text-white">

    <aside class="space-y-6 pt-4">
      <h1 class="text-2xl font-bold leading-tight">
        {{ selectedVideo.title }}
      </h1>

      <div class="border-b border-gray-800 my-2"></div>

      <ul class="space-y-3 text-sm text-gray-400">
        <li class="flex items-center gap-2">
          <CalendarDays class="w-4 h-4 text-indigo-400" />
          <span>{{ format(new Date(selectedVideo.createdAt), 'yyyy MMM dd') }}</span>
        </li>
        <li class="flex items-center gap-2">
          <Clock class="w-4 h-4 text-indigo-400" />
          <span class="italic text-gray-500">{{ formattedDuration }}</span>
        </li>
        <!-- Conditionally show counts -->
        <li v-if="user?.dbUser.role === 'admin'" class="flex flex-col space-y-1 text-gray-400">
          <div class="flex items-center gap-2">
            <Navigation class="w-4 h-4 text-indigo-400" />
            <span>{{ selectedVideo.visits.toLocaleString() }} visits</span>
          </div>
          <div class="flex items-center gap-2">
            <Eye class="w-4 h-4 text-indigo-400" />
            <span>{{ selectedVideo.views.toLocaleString() }} views</span>
          </div>
          <div class="flex items-center gap-2">
            <CheckCircle class="w-4 h-4 text-indigo-400" />
            <span>{{ selectedVideo.completes.toLocaleString() }} completes</span>
          </div>
        </li>
        <li v-else class="flex items-center gap-2">
          <Eye class="w-4 h-4 text-indigo-400" />
          <span>{{ selectedVideo.views.toLocaleString() }} views</span>
        </li>
      </ul>

      <div class="flex items-center gap-4 text-sm pt-1">
        <div 
          @click="handleLike"
          class="flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform"
          :class="userLiked ? 'text-green-400' : 'text-gray-400'"
        >
          <ThumbsUp class="w-4 h-4" />
          {{ selectedVideo.likes?.count ?? 0 }}
        </div>

        <div 
          @click="handleDislike"
          class="flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform"
          :class="userDisliked ? 'text-rose-400' : 'text-gray-400'"
        >
          <ThumbsDown class="w-4 h-4" />
          {{ selectedVideo.dislikes?.count ?? 0 }}
        </div>
      </div>

      <div class="flex items-center gap-2 text-sm text-gray-300 pt-2">
        <Folder class="w-4 h-4 text-indigo-400" />
        <span class="bg-gray-800 text-gray-200 px-2 py-1 rounded text-xs font-medium">
          {{ selectedVideo.category.name }}
        </span>
      </div>

      <div class="flex flex-wrap gap-2 pt-1">
        <span
          v-for="tag in selectedVideo.tags"
          :key="tag"
          class="inline-flex items-center bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs font-medium"
        >
          <Tag class="w-3 h-3 mr-1 text-indigo-400" />
          {{ tag }}
        </span>
      </div>

      <!-- Show Delete button only for admin -->
      <button
        v-if="user?.dbUser.role === 'admin'"
        @click="handleDelete"
        class="flex items-center gap-2 bg-rose-600 text-white px-3 py-2 rounded hover:bg-rose-700 transition"
      >
        <Trash2 class="w-4 h-4" />
        Delete Video
      </button>
    </aside>

    <section class="w-full rounded-xl overflow-hidden">
      <VideoPlayer :video="selectedVideo" />
    </section>
  </div>

  <div v-else-if="isLoading" class="grid grid-cols-[1fr_5fr] gap-10 px-4 sm:px-10 py-12 min-h-screen bg-[#0b0b0b] text-white animate-pulse">
    <aside class="space-y-6 pt-4">
      <div class="h-6 bg-gray-800 rounded w-3/4"></div>
      <div class="h-4 bg-gray-700 rounded w-2/3"></div>
      <ul class="space-y-2">
        <li class="h-4 bg-gray-700 rounded w-2/3"></li>
        <li class="h-4 bg-gray-700 rounded w-1/2"></li>
        <li class="h-4 bg-gray-700 rounded w-3/4"></li>
      </ul>
      <div class="h-4 bg-gray-700 rounded w-1/3 mt-4"></div>
      <div class="h-4 bg-gray-700 rounded w-1/3"></div>
    </aside>
    <section class="bg-gray-800 w-full h-96 rounded-xl"></section>
  </div>

  <div v-else class="flex justify-center items-center h-[90vh] text-gray-400 text-lg bg-[#0b0b0b]">
    Failed to load video. Please try again later.
  </div>
</template>
