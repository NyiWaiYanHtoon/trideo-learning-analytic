<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue';

// Define optional prop for placeholder
const props = defineProps<{
  placeholder?: string;
}>();

// Emit search updates
const emit = defineEmits<{
  (e: 'update:search', value: string): void;
}>();

const input = ref('');
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

watch(input, (newValue) => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    emit('update:search', newValue);
  }, 500);
});
</script>

<template>
  <div class="px-6 pt-6">
    <input
      v-model="input"
      type="text"
      :placeholder="props.placeholder || 'Search...'"
      class="w-full p-3 rounded-md bg-[#1f1f1f] border border-[#333] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</template>
