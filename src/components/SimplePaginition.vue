<script setup lang="ts">
import { defineProps, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  page: number
  setPage: (newPage: number) => void
  disableBack: boolean
  disableForward: boolean
  isDark?: boolean
}>()

const goBack = () => {
  if (!props.disableBack) {
    props.setPage(props.page - 1)
  }
}

const goForward = () => {
  if (!props.disableForward) {
    props.setPage(props.page + 1)
  }
}

const buttonClasses = computed(() =>
  props.isDark
    ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
    : 'bg-white border border-gray-300 text-gray-800 hover:bg-gray-100'
)

const pageTextClass = computed(() =>
  props.isDark
    ? 'text-purple-400 font-semibold bg-gray-900 border border-gray-700 px-4 py-1 rounded-md'
    : 'text-gray-800 bg-white border border-gray-300 px-4 py-1 rounded-md'
)
</script>

<template>
  <div class="flex justify-center items-center gap-4 mt-6">
    <button
      class="flex items-center justify-center w-9 h-9 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
      :class="buttonClasses"
      :disabled="disableBack"
      @click="goBack"
    >
      <ChevronLeft class="w-4 h-4" />
    </button>

    <span :class="pageTextClass">
      {{ page }}
    </span>

    <button
      class="flex items-center justify-center w-9 h-9 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
      :class="buttonClasses"
      :disabled="disableForward"
      @click="goForward"
    >
      <ChevronRight class="w-4 h-4" />
    </button>
  </div>
</template>
