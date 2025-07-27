<script setup lang="ts">
import Navbar from './Navbar.vue'
</script>
<template>
    <div class="min-h-screen flex flex-col bg-gray-950 text-white">
        <div class="mb-20">
            <Navbar/>
        </div>
        <main class="flex-1">
            <router-view />
        </main>
    </div>
</template>
