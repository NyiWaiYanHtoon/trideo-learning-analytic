<script setup lang="ts">
const props = defineProps<{username: string}>()
</script>

<template>
  <nav class="bg-white shadow-sm py-4 px-6 md:px-10 flex items-center justify-between">
    <h1
      class="text-2xl md:text-3xl font-bold tracking-wider bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent"
    >
      Learning Analytics System
    </h1>

    <div class="flex items-center gap-4">
      <span class="text-gray-700 text-sm hidden sm:inline">Welcome, {{username}}</span>
      <button
        type="button"
        class="bg-red-500 hover:bg-red-600 text-white font-medium rounded-md text-sm px-4 py-2 transition duration-150"
      >
        Sign Out
      </button>
    </div>
  </nav>
</template>
