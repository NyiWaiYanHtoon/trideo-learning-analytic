<script setup lang="ts">
import { ref } from "vue";
import UploadDialog from "./UploadDialog.vue";
import { Film, Plus } from "lucide-vue-next";
import OverallStats from "./OverallStats.vue";
import UserStatsTable from "./UserStatsTable.vue";
import VideoStats from "./VideoStats.vue";
import { useRouter } from 'vue-router';

const router = useRouter();
type TTimeFrame = 'today' | 'week' | 'all';
const showDialog = ref(false);
const timeframe = ref<TTimeFrame>('all');
</script>

<template>
  <div class="text-white min-h-screen px-4 py-6 md:px-8 space-y-10">

    <!-- Header Controls -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      
      <!-- Timeframe Filter -->
      <div class="flex flex-wrap gap-3">
        <button
          v-for="option in ['all', 'today', 'week']"
          :key="option"
          @click="timeframe = option as TTimeFrame"
          class="px-5 py-2 rounded-full text-sm font-medium capitalize transition border shadow-sm"
          :class="timeframe === option
            ? 'bg-white text-black border-white'
            : 'bg-[#1a1a1a] text-gray-400 border-[#333] hover:bg-[#222] hover:text-purple-400'"
        >
          {{ option === 'all' ? 'All Time' : option === 'week' ? 'This Week' : 'Today' }}
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-3">
        <!-- Browse Videos -->
        <button
          @click="() => router.push({ name: 'Home' })"
          class="flex items-center gap-2 px-5 py-2.5 rounded-md border border-[#333] bg-gradient-to-r from-[#1f1f1f] to-[#191919] text-white text-sm font-medium hover:text-purple-400 hover:from-[#252525] hover:to-[#1f1f1f] transition-colors"
        >
          <Film class="w-4 h-4" />
          <span>Browse Videos</span>
        </button>

        <!-- Upload Button -->
        <button
          @click="showDialog = true"
          class="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#333] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold transition-colors"
        >
          <Plus class="w-4 h-4" />
          <span>Upload</span>
        </button>
      </div>
    </div>

    <!-- Stats Sections -->
    <div class="space-y-8">
      <OverallStats :timeframe="timeframe" />
      <VideoStats :timeframe="timeframe" />
      <UserStatsTable />
    </div>

    <!-- Upload Dialog -->
    <UploadDialog v-model:show="showDialog" />
  </div>
</template>
