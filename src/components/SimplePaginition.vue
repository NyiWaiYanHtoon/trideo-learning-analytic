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
    ? 'bg-[#1e1e1e] hover:bg-[#2a2a2a] border border-[#444] text-white'
    : 'bg-transparent hover:bg-gray-300 text-gray-800'
)

const pageTextClass = computed(() =>
  props.isDark ? 'text-white bg-[#1a1a1a]' : 'text-gray-800 bg-transparent'
)

console.log(buttonClasses.value, "@@");
console.log(pageTextClass.value, "@@");

</script>

<template>
  <div class="flex justify-center items-center gap-5 mt-6">
    <button
      class="flex items-center justify-center w-8 h-8 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
      :class="buttonClasses"
      :disabled="disableBack"
      @click="goBack"
    >
      <ChevronLeft class="w-4 h-4" />
    </button>

    <span
      class="text-sm font-medium px-4 py-1 rounded-md"
      :class="pageTextClass"
    >
      {{ page }}
    </span>

    <button
      class="flex items-center justify-center w-8 h-8 rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
      :class="buttonClasses"
      :disabled="disableForward"
      @click="goForward"
    >
      <ChevronRight class="w-4 h-4" />
    </button>
  </div>
</template>
