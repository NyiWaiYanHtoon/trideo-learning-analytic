<script setup lang="ts">
import { ref, computed } from 'vue'
const props = defineProps<{
  timeframe: 'today' | 'week' | 'all';
}>()

// TODO: Fetch according to the value fo timeframe
// fetch into current 

const stats = {
  today: { visits: 120, views: 80, completions: 40 },
  week: { visits: 760, views: 510, completions: 315 },
  all: { visits: 9520, views: 7230, completions: 5010 }
}

const current = computed(() => stats[props.timeframe] || { visits: 0, views: 0, completions: 0 })

const viewRate = computed(() =>
  current.value.visits ? ((current.value.views / current.value.visits) * 100).toFixed(1) : '0.0'
)

const completionRate = computed(() =>
  current.value.views ? ((current.value.completions / current.value.views) * 100).toFixed(1) : '0.0'
)

</script>

<template>
  <div class="w-full px-6 py-8 text-white space-y-6">
    <!-- Stats Grid -->
    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Visits -->
      <div class="bg-[#1e1e1e] border border-[#333] rounded-xl p-5 shadow">
        <h3 class="text-sm text-gray-400 mb-1">Visited</h3>
        <p class="text-2xl font-semibold text-white">{{ current.visits }}</p>
      </div>

      <!-- Views -->
      <div class="bg-[#1e1e1e] border border-[#333] rounded-xl p-5 shadow">
        <h3 class="text-sm text-gray-400 mb-1">Viewed</h3>
        <p class="text-2xl font-semibold text-white">{{ current.views }}</p>
      </div>

      <!-- Completions -->
      <div class="bg-[#1e1e1e] border border-[#333] rounded-xl p-5 shadow">
        <h3 class="text-sm text-gray-400 mb-1">Completed</h3>
        <p class="text-2xl font-semibold text-white">{{ current.completions }}</p>
      </div>

      <!-- View Rate -->
      <div class="bg-[#1e1e1e] border border-[#333] rounded-xl p-5 shadow">
        <h3 class="text-sm text-gray-400 mb-1">View Rate</h3>
        <p class="text-2xl font-semibold text-white">{{ viewRate }}%</p>
      </div>

      <!-- Completion Rate -->
      <div class="bg-[#1e1e1e] border border-[#333] rounded-xl p-5 shadow">
        <h3 class="text-sm text-gray-400 mb-1">Completion Rate</h3>
        <p class="text-2xl font-semibold text-white">{{ completionRate }}%</p>
      </div>
    </div>
  </div>
</template>
