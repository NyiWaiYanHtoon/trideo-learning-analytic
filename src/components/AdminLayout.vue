<script setup lang="ts">
import AdminNavbar from './AdminNavbar.vue';
</script>
<template>
    <div class="min-h-screen flex flex-col bg-black text-white p-5">
        <div class="mb-8">
            <AdminNavbar username="Joey"/>
        </div>
        <main class="flex-1">
            <router-view />
        </main>
    </div>
</template>
