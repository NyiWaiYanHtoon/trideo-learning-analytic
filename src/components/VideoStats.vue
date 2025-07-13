<script setup lang="ts">
import { ref, watch } from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'vue-chartjs'
import type { PropType } from 'vue'
import SimplePaginition from './SimplePaginition.vue'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  timeframe: {
    type: String as PropType<'today' | 'week' | 'all'>,
    required: true
  }
})

const chartData = ref<{
  labels: string[],
  datasets: any[]
}>({
  labels: [],
  datasets: []
})

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true },
  },
  scales: {
    x: { ticks: { color: '#6b21a8' } },
    y: { ticks: { color: '#6b21a8' } }
  }
})

const page= ref(1);
const setPage= (newPage: number)=>{
    page.value= newPage
}

const mostViewedVideos = ref<any[]>([])
const leastViewedVideos = ref<any[]>([])

const fetchStats = async () => {
  // Simulated delay
  await new Promise(res => setTimeout(res, 400))

  // TODO: fetch according to 
  const dummyVideos = Array.from({ length: 10 }, (_, i) => ({
    title: `Video ${i + 1}`,
    completions: Math.floor(Math.random() * 100),
  }))

  chartData.value = {
    labels: dummyVideos.map(v => v.title),
    datasets: [{
      label: 'Completions',
      data: dummyVideos.map(v => v.completions),
      backgroundColor: '#6b21a8',
    }]
  }

  mostViewedVideos.value = [
    {
      title: 'Best Algebra Guide',
      thumbnail: '/images/example_thumbnail.png',
      uploadedAt: '2025-06-01'
    },
    {
      title: 'Calculus Deep Dive',
      thumbnail: '/images/example_thumbnail.png',
      uploadedAt: '2025-06-05'
    },
    {
      title: 'Intro to Chemistry',
      thumbnail: '/images/example_thumbnail.png',
      uploadedAt: '2025-06-10'
    }
  ]

  leastViewedVideos.value = [
    {
      title: 'Basics of Biology',
      thumbnail: '/images/example_thumbnail.png',
      uploadedAt: '2025-05-20'
    },
    {
      title: 'Statistics Crash Course',
      thumbnail: '/images/example_thumbnail.png',
      uploadedAt: '2025-05-18'
    },
    {
      title: 'Organic Chemistry 101',
      thumbnail: '/images/example_thumbnail.png',
      uploadedAt: '2025-05-22'
    }
  ]
}
watch([() => props.timeframe, page], fetchStats, { immediate: true })
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-[4fr_1fr] gap-8 px-4 py-6">
    <!-- Left Column: Bar Chart -->
    <div class="bg-transparent rounded-xl px-5">
      <h2 class="text-white text-lg font-semibold mb-4">Video Completion Stats</h2>
      <Bar :data="chartData" :options="chartOptions"/>
      <div class="flex justify-end">
        <SimplePaginition :page="page" :setPage="setPage" :disableBack="page<=1" :disableForward="page>=10" :isDark="true"/>
      </div>
    </div>
    <!-- Right Column: Video Lists -->
    <div class="space-y-6 py-30">
      <!-- Most Viewed -->
      <div>
        <h3 class="text-white text-sm font-semibold mb-3 border-b border-[#444] pb-1">Most Viewed Videos</h3>
        <ul class="space-y-3">
          <li
            v-for="(video, index) in mostViewedVideos"
            :key="index"
            class="flex items-center gap-3 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-purple-400 via-purple-600 to-indigo-400 transition-colors"
          >
            <img :src="video.thumbnail" alt="thumb" class="w-25 h-12 object-cover rounded" />
            <div class="text-sm">
              <p class="text-md">{{ video.title }}</p>
              <p class="text-xs text-gray-400">Uploaded on {{ video.uploadedAt }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Least Viewed -->
      <div>
        <h3 class="text-white text-sm font-semibold mb-3 border-b border-[#444] pb-1">Least Viewed Videos</h3>
        <ul class="space-y-3">
          <li
            v-for="(video, index) in leastViewedVideos"
            :key="index"
            class="flex items-center gap-3 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-purple-400 via-purple-600 to-indigo-400 transition-colors"
          >
            <img :src="video.thumbnail" alt="thumb" class="w-25 h-12 object-cover rounded" />
            <div class="text-sm">
              <p class="text-md">{{ video.title }}</p>
              <p class="text-xs text-gray-400">Uploaded on {{ video.uploadedAt }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
