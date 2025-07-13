<script setup lang="ts">
defineProps<{
  video: {
    url: string;
    title: string;
    description: string;
  };
}>();
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 space-y-6">
   
    <div class="aspect-video bg-black rounded-sm overflow-hidden shadow-xl border border-gray-200">
      <video class="w-full h-full object-cover" controls autoplay>
        <source :src="video.url" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>

    
    <div class="space-y-2 border-t pt-4 border-gray-200 px-1">
      <h2 class="text-2xl font-bold text-gray-800 tracking-tight">
        {{ video.title }}
      </h2>
      <p class="text-gray-600 text-base leading-relaxed">
        {{ video.description }}
      </p>
    </div>
  </div>
</template>
