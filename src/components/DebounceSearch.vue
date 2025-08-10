<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'
import { Search } from 'lucide-vue-next'  // Search icon
import Input from './shadcn/input/Input.vue';

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
    <div class="relative w-full">
      <Input
        v-model="input"
        type="text"
        :placeholder="props.placeholder || 'Search...'"
        class="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 italic text-md
               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
      />
      <Search
        class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5"
      />
    </div>
  </div>
</template>
