<script setup lang="ts">
import { getUser } from '@/utils/get-user';
import { handleSignOut } from '@/utils/handle-signout';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref('');
const loading = ref(true);

onMounted(async () => {
  try {
    const user = await getUser();
    if (user) {
      username.value = user.email.split('@')[0];
    }
  } catch (err) {
    console.error('Failed to load user', err);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <nav class="bg-[#1f1f1f] shadow-sm py-4 px-6 md:px-10 flex items-center justify-between">
    <h1
      class="text-2xl md:text-3xl font-bold tracking-wider bg-gradient-to-r from-purple-400 via-purple-600 to-indigo-500 bg-clip-text text-transparent"
    >
      Analytic Dashboard
    </h1>

    <div class="flex items-center gap-4">
      <!-- Loading placeholder -->
      <span class="text-gray-300 text-sm hidden sm:inline">
        <template v-if="!loading">Welcome, {{ username }}</template>
        <template v-else>
          <div class="h-4 w-24 bg-gray-600 rounded animate-pulse inline-block"></div>
        </template>
      </span>

      <!-- Sign Out -->
      <button
        type="button"
        @click="handleSignOut(router)"
        :disabled="loading"
        class="bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-md text-sm px-4 py-2 transition duration-150"
      >
        Sign Out
      </button>
    </div>
  </nav>
</template>
