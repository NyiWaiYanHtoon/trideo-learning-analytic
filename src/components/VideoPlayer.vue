<script setup lang="ts">
import { ref } from 'vue';
import { produceToKafka } from '@/utils/produce-kafka-topic';

const props = defineProps<{
  video: {
    id: string;
    title: string;
    description: string;
    tags: string[];
    videoUrl: string;
    thumbnailUrl: string;
    createdAt: Date;
    category: { name: string };
    likes: { count: number } | null;
    dislikes: { count: number } | null;
    views: number;
  };
}>();

const video = props.video;
const hasViewed = ref(false);

const handlePlay = async () => {
  if (!hasViewed.value) {
    await produceToKafka("video-view", video.id);
    hasViewed.value = true;
  }
};
const handleEnded = async () => {
  await produceToKafka("video-complete", video.id);
};

</script>

<template>
  <div class="max-w-6xl mx-auto px-4 space-y-6 text-white">
    <!-- Video -->
    <div class="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
      <video
        class="w-full h-full object-cover"
        controls
        @play="handlePlay"
        @ended="handleEnded"
      >
        <source :src="video.videoUrl" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

    <!-- Title + Description -->
    <div class="space-y-4 px-1">
      <!-- Title -->
      <h2 class="text-2xl font-semibold text-white tracking-tight">
        {{ video.title }}
      </h2>

      <!-- Description -->
      <div class="bg-gray-800/70 border border-gray-700 shadow-md p-4 rounded-xl text-sm leading-relaxed">
        <h3 class="font-medium text-purple-400 mb-2 text-base">Description</h3>
        <p class="whitespace-pre-wrap">
          {{ video.description }}
        </p>
      </div>
    </div>
  </div>
</template>
