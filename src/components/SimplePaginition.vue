<script setup lang="ts">
import { defineProps, computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import Button from "./shadcn/button/Button.vue";

const props = defineProps<{
  page: number;
  setPage: (newPage: number) => void;
  disableBack: boolean;
  disableForward: boolean;
  isDark?: boolean;
}>();

const goBack = () => {
  if (!props.disableBack) {
    props.setPage(props.page - 1);
  }
};

const goForward = () => {
  if (!props.disableForward) {
    props.setPage(props.page + 1);
  }
};
</script>

<template>
  <div class="space-x-2 flex items-center gap-2">
    <Button variant="outline" size="sm" :disabled="disableBack" @click="goBack">
      <ChevronLeft class="w-4 h-4" />
    </Button>
    <span class="text-xs font-medium select-none">  {{ page }} </span>
    <Button
      variant="outline"
      size="sm"
      :disabled="disableForward"
      @click="goForward"
    >
      <ChevronRight class="w-4 h-4" />
    </Button>
  </div>
</template>
