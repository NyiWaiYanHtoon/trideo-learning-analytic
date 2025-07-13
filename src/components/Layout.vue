<script setup lang="ts">
import Navbar from './Navbar.vue'
</script>
<template>
    <div class="min-h-screen flex flex-col p-5">
        <div class="mb-8">
            <Navbar username="Joey" />
        </div>
        <main class="flex-1">
            <router-view />
        </main>
    </div>
</template>
