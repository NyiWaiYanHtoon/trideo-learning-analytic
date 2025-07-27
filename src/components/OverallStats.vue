<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue';

const props = defineProps<{
  timeframe: 'today' | 'week' | 'all';
}>();

type TOverallStats = {
  visits: number;
  views: number;
  completions: number;
};

const stats = ref<TOverallStats | null>(null);
const loading = ref(true);
const error = ref(false);

watchEffect(async () => {
  loading.value = true;
  error.value = false;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/stats/overall`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeframe: props.timeframe })
      }
    );

    if (!res.ok) throw new Error('Failed to fetch stats');

    const data: TOverallStats = await res.json();
    stats.value = data || { visits: 0, views: 0, completions: 0 };
  } catch (err) {
    console.error('Failed to fetch stats:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
});

const viewRate = computed(() =>
  stats.value && stats.value.visits
    ? ((stats.value.views / stats.value.visits) * 100).toFixed(1)
    : '0.0'
);

const completionRate = computed(() =>
  stats.value && stats.value.views
    ? ((stats.value.completions / stats.value.views) * 100).toFixed(1)
    : '0.0'
);
</script>

<template>
  <div class="w-full px-2 sm:px-6 py-8 text-white space-y-6">
    <!-- Loading Skeleton -->
    <div v-if="loading" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
      <div v-for="n in 5" :key="n" class="bg-gray-800/70 border border-gray-700 rounded-2xl p-6 shadow-inner">
        <div class="h-4 bg-gray-600/70 w-1/3 mb-3 rounded"></div>
        <div class="h-6 bg-gray-700/80 w-2/3 rounded"></div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-else-if="error" class="text-center text-red-400 text-lg">
      Failed to load statistics. Please try again later.
    </div>

    <!-- Stats -->
    <div v-else-if="stats" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="(value, key) in [
          { title: 'Visited', value: stats.visits },
          { title: 'Viewed', value: stats.views },
          { title: 'Completed', value: stats.completions },
          { title: 'View Rate', value: viewRate + '%' },
          { title: 'Completion Rate', value: completionRate + '%' }
        ]"
        :key="value.title"
        class="bg-gray-800/70 border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-lg transition"
      >
        <h3 class="text-sm text-gray-400 mb-1 tracking-wide uppercase">
          {{value.title }}
        </h3>
        <p class="text-3xl font-bold text-white tracking-tight">
          {{ value.value }}
        </p>
      </div>
    </div>
  </div>
</template>
