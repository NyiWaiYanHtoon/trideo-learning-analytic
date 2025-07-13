<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { PropType } from "vue";
import SimplePaginition from "./SimplePaginition.vue";

const props = defineProps({
    timeframe: {
        type: String as PropType<"today" | "week" | "all">,
        required: true,
    },
});

const page = ref(1);
const search = ref("");
const users = ref<any[]>([]);
const loading = ref(false);
const rowsPerPage = 10;

//TODO: fetch total users here
const totalUsers = 100;

const fetchUsers = async () => {
    loading.value = true;
    await new Promise((res) => setTimeout(res, 500));
    // TODO: fetch data here with changing offset and limit
    const dummyUsers = Array.from({ length: rowsPerPage }, (_, i) => ({
        email: `user${(page.value - 1) * rowsPerPage + i + 1}@example.com`,
        joinedAt: "2025-07-01",
        mostViewedCategory: "Math",
        mostVisitedCategory: "Science",
        mostViewedVideo: {
            title: "Algebra Basics",
            thumbnail: "/images/example_thumbnail.png",
        },
    }));
    users.value = dummyUsers;

    loading.value = false;
};

watch([() => props.timeframe, page, search], fetchUsers, { immediate: true });

const totalPages = computed(() => Math.ceil(totalUsers / rowsPerPage));
</script>

<template>
    <div class="space-y-4">
        <!-- Search Input -->
        <div class="flex justify-end items-center w-full">
            <input v-model="search" type="text" placeholder="Search by email"
                class="px-4 py-2 w-full max-w-sm rounded-lg bg-[#1e1e1e] border border-[#333] text-white placeholder-gray-400 focus:outline-none focus:ring focus:border-blue-500" />
        </div>

        <!-- Table -->
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
                    <tr v-for="(user, index) in users" :key="index" class="border-b border-[#333] hover:text-purple-800 cursor-pointer">
                        <td class="px-4 py-3">{{ user.email }}</td>
                        <td class="px-4 py-3">{{ user.joinedAt }}</td>
                        <td class="px-4 py-3">{{ user.mostViewedCategory }}</td>
                        <td class="px-4 py-3">{{ user.mostVisitedCategory }}</td>
                        <td class="px-4 py-3 flex items-center gap-3">
                            <img :src="user.mostViewedVideo.thumbnail" alt="thumb"
                                class="w-12 h-8 object-cover rounded" />
                            <span>{{ user.mostViewedVideo.title }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination (External Component) -->
        <div class="flex justify-end">
            <SimplePaginition :page="page" :setPage="(p: number) => (page = p)" :disableBack="page <= 1"
                :disableForward="page >= totalPages" :isDark="true" />
        </div>
    </div>
</template>
