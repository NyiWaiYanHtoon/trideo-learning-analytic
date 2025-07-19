<script setup lang="ts">
import { getUser } from '@/utils/get-user';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { handleSignOut } from '@/utils/handle-signout';

const username = ref('');
const userRole = ref('user');
const loading = ref(true);

const router = useRouter();

onMounted(async () => {
  try {
    const user = await getUser();
    if (user) {
      username.value = user.email.split('@')[0];
      userRole.value = user.role;
    }
  } catch (err) {
    console.error('Failed to load user:', err);
  } finally {
    loading.value = false;
  }
});

const goToDashboard = () => {
  router.push('/admin/analytics');
};
</script>


<template>
  <nav class="bg-[#1f1f1f] shadow-sm py-4 px-6 md:px-10 flex items-center justify-between">
    <h1
      class="text-2xl md:text-3xl font-bold tracking-wider bg-gradient-to-r from-purple-400 via-purple-600 to-indigo-500 bg-clip-text text-transparent"
    >
      Learning Analytic System
    </h1>

    <div class="flex items-center gap-4">
      <!-- Username or Skeleton -->
      <span class="text-gray-300 text-sm hidden sm:inline">
        <template v-if="!loading">Welcome, {{ username }}</template>
        <template v-else>
          <div class="h-4 w-24 bg-gray-600 rounded animate-pulse inline-block"></div>
        </template>
      </span>

      <!-- Admin Dashboard Button (Only when not loading) -->
      <button
        v-if="!loading && userRole === 'admin'"
        @click="goToDashboard"
        type="button"
        class="bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 text-white font-semibold rounded-md text-sm px-4 py-2 shadow-lg transition duration-150"
      >
        Go to Analytics Dashboard
      </button>

      <!-- Sign Out Button -->
      <button
        v-if="!loading"
        type="button"
        @click="handleSignOut(router)"
        class="bg-red-500 hover:bg-red-600 text-white font-medium rounded-md text-sm px-4 py-2 transition duration-150"
      >
        Sign Out
      </button>
    </div>
  </nav>
</template>

