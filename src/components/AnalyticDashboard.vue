<script setup lang="ts">
import { ref } from "vue";
import UploadDialog from "./UploadDialog.vue";
import { Film, Plus } from "lucide-vue-next";
import OverallStats from "./OverallStats.vue";
import UserStatsTable from "./UserStatsTable.vue";
import VideoStats from "./VideoStats.vue";
import { useRouter } from 'vue-router'

const router = useRouter()
type TTimeFrame = 'today' | 'week' | 'all';
const showDialog = ref(false);
const timeframe = ref<TTimeFrame>('today');
</script>

<template>
  <div class="px-6 py-6 space-y-8 bg-black/80 min-h-screen">

    <!-- Header Controls -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <!-- Timeframe Filter -->
      <div class="flex gap-3">
        <button
          v-for="option in ['today', 'week', 'all']"
          :key="option"
          @click="timeframe = option as TTimeFrame"
          class="px-4 py-1.5 rounded-full text-sm font-medium capitalize transition border"
          :class="timeframe === option
            ? 'bg-white text-black border-white'
            : 'bg-[#1f1f1f] text-gray-400 border-[#333] hover:bg-[#2a2a2a] hover:text-purple-400'"
        >
          {{ option === 'all' ? 'All Time' : option === 'week' ? 'This Week' : 'Today' }}
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-3">
        <!-- Browse Videos -->
        <button
          class="flex items-center gap-2 px-5 py-2.5 rounded-md border border-[#333] bg-[#1f1f1f] text-white text-sm font-medium hover:bg-[#2a2a2a] hover:text-purple-400 transition-colors shadow-sm"
          @click="()=>router.push({name: 'Home'})"
        >
          <Film class="w-4 h-4" />
          <span>Browse Videos</span>
        </button>
        
        <!-- Upload -->
        <button
          class="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#333] bg-[#1f1f1f] text-white text-sm font-medium hover:bg-[#2a2a2a] hover:text-purple-400 transition-colors shadow-sm"
          @click="showDialog = true"
        >
          <Plus class="w-4 h-4" />
          <span>Upload</span>
        </button>
      </div>
    </div>

    <!-- Stats Sections -->
    <OverallStats :timeframe="timeframe" />
    <VideoStats :timeframe="timeframe" />
    <UserStatsTable :timeframe="timeframe" />

    <!-- Upload Dialog -->
    <UploadDialog v-model:show="showDialog" />
  </div>
</template>
