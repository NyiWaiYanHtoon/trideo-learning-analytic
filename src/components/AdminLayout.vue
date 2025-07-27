<script setup lang="ts">
import AdminNavbar from './AdminNavbar.vue';
</script>
<template>
    <div class="min-h-screen flex flex-col bg-gray-950 text-white">
        <div class="mb-20">
            <AdminNavbar/>
        </div>
        <main class="flex-1">
            <router-view />
        </main>
    </div>
</template>
