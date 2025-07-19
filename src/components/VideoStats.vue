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
  <div class="w-full p-6 grid grid-cols-[4fr_1fr] gap-4">
    <!-- Chart Section -->
    <div class="flex flex-col bg-[#1e1e1e] rounded-xl p-6 shadow-inner border border-[#2c2c2c] min-h-[400px]">
      <div v-if="isLoadingChart" class="text-center text-purple-300 animate-pulse">Loading chart...</div>
      <div v-else-if="chartError" class="text-center text-red-400 mt-30">{{ chartError }}</div>
      <Bar v-else :data="chartData" :options="chartOptions" />

      <div class="flex justify-end mt-6">
        <SimplePaginition
          :page="page"
          :setPage="(p: number) => (page = p)"
          :disableBack="page <= 1"
          :disableForward="page >= Math.ceil(totalVideos / 5)"
          :isDark="true"
        />
      </div>
    </div>

    <!-- Lists Section -->
    <div class="space-y-8">
      <div class="bg-[#1e1e1e] border border-[#333] rounded-xl shadow p-5">
        <h2 class="text-2xl font-semibold text-white mb-4 pb-2">
          Most Viewed Videos
        </h2>

        <div v-if="isLoadingList" class="text-center text-purple-300 animate-pulse">Loading list...</div>
        <div v-else-if="listError" class="text-red-400">{{ listError }}</div>
        <ul v-else class="space-y-3 max-h-[320px] overflow-y-auto">
          <li
            v-for="video in mostViewedVideos"
            :key="video.id"
            class="flex items-center gap-4 hover:bg-purple-900 rounded p-2 cursor-pointer transition-colors"
          >
            <img :src="video.thumbnailUrl" alt="thumbnail" class="w-20 h-12 object-cover rounded" />
            <div class="flex flex-col text-gray-300">
              <p class="font-semibold">{{ video.title }}</p>
              <p class="text-xs text-gray-400">
                Uploaded on {{ new Date(video.createdAt).toLocaleDateString() }}
              </p>
            </div>
          </li>
          <li v-if="mostViewedVideos.length === 0" class="text-gray-400 text-sm text-center">No data.</li>
        </ul>
      </div>

      <div class="bg-[#1e1e1e] border border-[#333] rounded-xl shadow p-5">
        <h2 class="text-2xl font-semibold text-white mb-4 pb-2">
          Least Viewed Videos
        </h2>

        <div v-if="isLoadingList" class="text-center text-purple-300 animate-pulse">Loading list...</div>
        <div v-else-if="listError" class="text-red-400">{{ listError }}</div>
        <ul v-else class="space-y-3 max-h-[320px] overflow-y-auto">
          <li
            v-for="video in leastViewedVideos"
            :key="video.id"
            class="flex items-center gap-4 hover:bg-purple-900 rounded p-2 cursor-pointer transition-colors"
          >
            <img :src="video.thumbnailUrl" alt="thumbnail" class="w-20 h-12 object-cover rounded" />
            <div class="flex flex-col text-gray-300">
              <p class="font-semibold">{{ video.title }}</p>
              <p class="text-xs text-gray-400">
                Uploaded on {{ new Date(video.createdAt).toLocaleDateString() }}
              </p>
            </div>
          </li>
          <li v-if="leastViewedVideos.length === 0" class="text-gray-400 text-sm text-center">No data.</li>
        </ul>
      </div>
    </div>
  </div>
</template>
