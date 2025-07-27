<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'
import type { PropType } from 'vue'
import SimplePaginition from './SimplePaginition.vue'

const props = defineProps({
  timeframe: {
    type: String as PropType<'today' | 'week' | 'all'>,
    required: true
  }
})

type TVideosWithStats = {
  videos: {
    video: {
      id: string;
      title: string;
      description: string;
      tags: string[];
      categoryId: string;
      videoUrl: string;
      thumbnailUrl: string;
      createdAt: Date;
      duration: number;
    };
    visit_count: number;
    view_count: number;
    complete_count: number;
  }[];
  total: number;
}

type TVideo = {
  title: string;
  description: string;
  tags: string[];
  duration: number;
  id: string;
  categoryId: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: Date;
}

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// State
const chartData = ref<ChartData<'bar', number[], string>>({ labels: [], datasets: [] })
const chartOptions = ref<ChartOptions<'bar'>>({
  responsive: true,
  plugins: {
    legend: { display: true, labels: { color: '#d1d5db' } },
  },
  scales: {
    x: { ticks: { color: '#c4b5fd' }, grid: { color: '#444' } },
    y: { ticks: { color: '#c4b5fd' }, grid: { color: '#444' } }
  }
})
const page = ref(1)
const totalVideos = ref(0)

const mostViewedVideos = ref<TVideo[]>([])
const leastViewedVideos = ref<TVideo[]>([])

const isLoadingChart = ref(false)
const chartError = ref('')

const isLoadingList = ref(false)
const listError = ref('')

// Fetch chart stats
const fetchStats = async () => {
  isLoadingChart.value = true
  chartError.value = ''

  const statsUrl = `${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/videos/stats?page=${page.value}` +
    (props.timeframe ? `&timestamp=${props.timeframe}` : '')

  try {
    const res = await fetch(statsUrl)
    if (!res.ok) throw new Error('Failed to fetch stats')

    const result: TVideosWithStats = await res.json()
    chartData.value = {
      labels: result.videos.map(v => v.video.title),
      datasets: [
        {
          label: 'Visits',
          backgroundColor: 'rgba(128, 128, 128, 0.7)',
          data: result.videos.map(v => v.visit_count)
        },
        {
          label: 'Views',
          backgroundColor: 'rgba(147, 112, 219, 0.7)',
          data: result.videos.map(v => v.view_count)
        },
        {
          label: 'Completions',
          backgroundColor: 'rgba(230, 230, 250, 0.8)',
          data: result.videos.map(v => v.complete_count)
        }
      ]
    }
    totalVideos.value = result.total
  } catch (err) {
    chartError.value = 'Error loading chart data.'
  } finally {
    isLoadingChart.value = false
  }
}

// Fetch most/least viewed
const fetchTopVideos = async () => {
  isLoadingList.value = true
  listError.value = ''

  try {
    const most = await fetch(`${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/videos/most-viewed`)
    if (!most.ok) throw new Error('Failed most-viewed')
    mostViewedVideos.value = (await most.json()).videos

    const least = await fetch(`${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/videos/least-viewed`)
    if (!least.ok) throw new Error('Failed least-viewed')
    leastViewedVideos.value = (await least.json()).videos
  } catch (err) {
    listError.value = 'Error loading top video lists.'
  } finally {
    isLoadingList.value = false
  }
}

watch([() => props.timeframe, page], fetchStats, { immediate: true })
onMounted(() => fetchTopVideos())
</script>

<template>
  <div class="w-full xl:grid gap-6 xl:grid-cols-[2fr_1fr] p-6">
    <!-- Chart Panel -->
    <div class="bg-[#1e1e1e] rounded-xl border border-[#2f2f2f] p-4 shadow">
      <h2 class="text-lg font-semibold text-purple-400 mb-4">Video Engagement Chart</h2>

      <div v-if="isLoadingChart" class="text-center text-purple-300 animate-pulse py-12">
        Loading chart...
      </div>
      <div v-else-if="chartError" class="text-center text-red-400">{{ chartError }}</div>
      <Bar v-else :data="chartData" :options="chartOptions" />

      <div v-if="totalVideos > 5" class="mt-4">
        <SimplePaginition
          :page="page"
          :setPage="p => page = p"
          :disableBack="page <= 1"
          :disableForward="page >= Math.ceil(totalVideos / 5)"
          :isDark="true"
        />
      </div>
    </div>

    <!-- Sidebar Lists -->
    <div class="space-y-6 md:mt-0 mt-4">
      <div class="bg-[#1e1e1e] border border-[#333] rounded-xl shadow p-4">
        <h3 class="text-md font-bold text-white mb-2">Most Viewed</h3>
        <div v-if="isLoadingList" class="text-purple-300 animate-pulse text-center">Loading...</div>
        <div v-else-if="listError" class="text-red-400">{{ listError }}</div>
        <ul v-else class="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          <li v-for="video in mostViewedVideos" :key="video.id" class="flex items-center gap-3 hover:bg-purple-900/40 p-2 rounded">
            <img :src="video.thumbnailUrl" alt="thumb" class="w-16 h-10 object-cover rounded" />
            <div>
              <p class="text-sm font-semibold text-white truncate">{{ video.title }}</p>
              <p class="text-xs text-gray-400">{{ new Date(video.createdAt).toLocaleDateString() }}</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="bg-[#1e1e1e] border border-[#333] rounded-xl shadow p-4">
        <h3 class="text-md font-bold text-white mb-2">Least Viewed</h3>
        <ul class="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          <li v-for="video in leastViewedVideos" :key="video.id" class="flex items-center gap-3 hover:bg-purple-900/40 p-2 rounded">
            <img :src="video.thumbnailUrl" alt="thumb" class="w-16 h-10 object-cover rounded" />
            <div>
              <p class="text-sm font-semibold text-white truncate">{{ video.title }}</p>
              <p class="text-xs text-gray-400">{{ new Date(video.createdAt).toLocaleDateString() }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
