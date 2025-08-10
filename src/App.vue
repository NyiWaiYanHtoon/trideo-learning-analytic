<script setup lang="ts">
import { Toaster } from '@/components/shadcn/sonner'
import 'vue-sonner/style.css' // Required for vue-sonner v2
</script>

<template>
  <Toaster />
  <router-view />
</template>
