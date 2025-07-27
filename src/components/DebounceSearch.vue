<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'

const props = defineProps<{
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
}>()

const input = ref('')
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

watch(input, (newValue) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    emit('update:search', newValue)
  }, 500)
})
</script>

<template>
  <div class="px-6 pt-6">
    <input
      v-model="input"
      type="text"
      :placeholder="props.placeholder || 'Search...'"
      class="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-400"
    />
  </div>
</template>
