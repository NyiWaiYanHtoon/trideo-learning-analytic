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
  <div class="space-y-4 px-4 md:px-6 lg:px-8 py-6">
    <div class="pl-[60vw]">
      <DebounceSearch v-model:search="search" placeholder="Search by email..." />
    </div>

    <div v-if="error" class="text-red-400 text-sm text-center">
      {{ error }}
    </div>

    <div class="overflow-x-auto border border-[#2d2d2d] rounded-xl shadow">
      <table class="min-w-full text-sm text-left text-white">
        <thead class="bg-[#27272a] border-b border-[#444]">
          <tr>
            <th class="px-4 py-3 font-semibold">Email</th>
            <th class="px-4 py-3 font-semibold">Joined At</th>
            <th class="px-4 py-3 font-semibold">Most Viewed Category</th>
            <th class="px-4 py-3 font-semibold">Most Visited Category</th>
            <th class="px-4 py-3 font-semibold">Most Viewed Video</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-if="loading"
            v-for="i in rowsPerPage"
            :key="'skeleton-' + i"
            class="border-b border-[#2c2c2c] animate-pulse"
          >
            <td class="px-4 py-3"><div class="h-4 bg-[#3a3a3a] rounded w-24"></div></td>
            <td class="px-4 py-3"><div class="h-4 bg-[#3a3a3a] rounded w-20"></div></td>
            <td class="px-4 py-3"><div class="h-4 bg-[#3a3a3a] rounded w-28"></div></td>
            <td class="px-4 py-3"><div class="h-4 bg-[#3a3a3a] rounded w-28"></div></td>
            <td class="px-4 py-3 flex items-center gap-3">
              <div class="w-12 h-8 bg-[#3a3a3a] rounded"></div>
              <div class="h-4 bg-[#3a3a3a] rounded w-16"></div>
            </td>
          </tr>

          <tr
            v-if="!loading && !error"
            v-for="(user, index) in users"
            :key="index"
            class="border-b border-[#2c2c2c] hover:bg-[#1f1f1f] transition-colors"
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
                class="w-12 h-8 object-cover rounded border border-[#444]"
              />
              <span class="truncate max-w-[200px]">{{ user.mostViewedVideo?.title || '-' }}</span>
            </td>
          </tr>

          <tr v-if="!loading && !error && users.length === 0">
            <td colspan="5" class="text-center py-4 text-gray-400">
              No users found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="!error" class="flex justify-end mt-4">
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
