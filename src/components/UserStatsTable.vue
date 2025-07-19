<script setup lang="ts">
import { ref, watch, computed } from "vue";
import SimplePaginition from "./SimplePaginition.vue";
import DebounceSearch from "./DebounceSearch.vue";

const page = ref(1);
const search = ref("");
const users = ref<any[]>([]);
const loading = ref(false);
const error = ref('');
const totalUsers = ref(0);
const rowsPerPage = 10;

const fetchUsers = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await fetch(
      `${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/users?page=${page.value}&search=${search.value}`
    );
    if (!response.ok) throw new Error(`Server returned ${response.status}`);
    const data = await response.json();
    users.value = data.users;
    totalUsers.value = data.total;
  } catch (err) {
    console.error("Failed to fetch users:", err);
    error.value = "Failed to fetch users. Please try again later.";
  } finally {
    loading.value = false;
  }
};

watch([page, search], fetchUsers, { immediate: true });

const totalPages = computed(() => Math.ceil(totalUsers.value / rowsPerPage));
</script>

<template>
  <div class="space-y-4">
    <div class="flex justify-end items-center w-full">
      <DebounceSearch v-model:search="search" placeholder="search email..."/>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-red-400 text-sm">
      {{ error }}
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full text-sm text-left text-white border border-[#333]">
        <thead class="bg-[#2a2a2a] border-b border-[#444]">
          <tr>
            <th class="px-4 py-3 font-medium">Email</th>
            <th class="px-4 py-3 font-medium">Joined At</th>
            <th class="px-4 py-3 font-medium">Most Viewed Category</th>
            <th class="px-4 py-3 font-medium">Most Visited Category</th>
            <th class="px-4 py-3 font-medium">Most Viewed Video</th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading Skeleton -->
          <tr v-if="loading" v-for="i in rowsPerPage" :key="'skeleton-' + i" class="border-b border-[#333]">
            <td class="px-4 py-3 animate-pulse"><div class="h-4 bg-[#333] rounded w-24"></div></td>
            <td class="px-4 py-3 animate-pulse"><div class="h-4 bg-[#333] rounded w-20"></div></td>
            <td class="px-4 py-3 animate-pulse"><div class="h-4 bg-[#333] rounded w-28"></div></td>
            <td class="px-4 py-3 animate-pulse"><div class="h-4 bg-[#333] rounded w-28"></div></td>
            <td class="px-4 py-3 animate-pulse flex items-center gap-3">
              <div class="w-12 h-8 bg-[#333] rounded"></div>
              <div class="h-4 bg-[#333] rounded w-16"></div>
            </td>
          </tr>

          <!-- Actual User Data -->
          <tr
            v-if="!loading && !error"
            v-for="(user, index) in users"
            :key="index"
            class="border-b border-[#333] hover:text-purple-800 cursor-pointer"
          >
            <td class="px-4 py-3">{{ user.email }}</td>
            <td class="px-4 py-3">{{ new Date(user.joinedAt).toLocaleDateString() }}</td>
            <td class="px-4 py-3">{{ user.mostViewedCategory?.name || '-' }}</td>
            <td class="px-4 py-3">{{ user.mostVisitedCategory?.name || '-' }}</td>
            <td class="px-4 py-3 flex items-center gap-3">
              <img
                v-if="!!user.mostViewedVideo"
                :src="user.mostViewedVideo?.thumbnailUrl || '/images/placeholder.png'"
                alt="thumb"
                class="w-12 h-8 object-cover rounded"
              />
              <span>{{ user.mostViewedVideo?.title || '-' }}</span>
            </td>
          </tr>

          <!-- No Users Found -->
          <tr v-if="!loading && !error && users.length === 0">
            <td colspan="5" class="text-center py-4 text-gray-400">
              No users found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="!error" class="flex justify-end">
      <SimplePaginition
        :page="page"
        :setPage="(p: number) => (page = p)"
        :disableBack="page <= 1"
        :disableForward="page >= totalPages"
        :isDark="true"
      />
    </div>
  </div>
</template>
