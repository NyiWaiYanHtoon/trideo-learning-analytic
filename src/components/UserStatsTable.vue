<script setup lang="ts">
import { ref, watch, computed, h } from "vue";
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from "@tanstack/vue-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import {
  Drawer,
} from "@/components/shadcn/drawer"

import SimplePagination from "./SimplePaginition.vue";
import DebounceSearch from "./DebounceSearch.vue";
import EachUser from "./EachUser.vue";

interface User {
  id: string;
  email: string;
  joinedAt: string;
  mostViewedCategory?: { name: string };
  mostVisitedCategory?: { name: string };
  mostViewedVideo?: { id: string, thumbnailUrl: string; title?: string };
  mostVisitedVideo?: { id: string, thumbnailUrl?: string; title?: string };
}

const rowsPerPage = 10;
const page = ref(1);
const search = ref("");
const users = ref<User[]>([]);
const totalUsers = ref(0);
const loading = ref(false);
const error = ref("");

const selectedUser = ref<User | null>(null);
const isDrawerOpen = ref<boolean>(false);

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("joinedAt", {
    header: "Joined At",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  columnHelper.accessor("mostVisitedCategory", {
    header: "Most Visited Category",
    cell: (info) => info.getValue()?.name || "-",
  }),
  columnHelper.accessor("mostViewedCategory", {
    header: "Most Viewed Category",
    cell: (info) => info.getValue()?.name || "-",
  }),
  columnHelper.accessor("mostVisitedVideo", {
    header: "Most Visited Video",
    cell: (info) => {
      const video = info.getValue();
      if (!video) return "-";

      return h("div", { class: "flex items-center gap-3" }, [
        h("img", {
          src: video.thumbnailUrl || "/images/placeholder.png",
          alt: "thumb",
          class: "w-12 h-8 object-cover rounded border border-[#444]",
        }),
        h("span", { class: "truncate max-w-[200px]" }, video.title || "-"),
      ]);
    },
  }),
  columnHelper.accessor("mostViewedVideo", {
    header: "Most Viewed Video",
    cell: (info) => {
      const video = info.getValue();
      if (!video) return "-";

      return h("div", { class: "flex items-center gap-3" }, [
        h("img", {
          src: video.thumbnailUrl || "/images/placeholder.png",
          alt: "thumb",
          class: "w-12 h-8 object-cover rounded border border-[#444]",
        }),
        h("span", { class: "truncate max-w-[200px]" }, video.title || "-"),
      ]);
    },
  }),
];

const fetchUsers = async () => {
  loading.value = true;
  error.value = "";
  try {
    const res = await fetch(
      `${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/users?page=${page.value}&search=${encodeURIComponent(search.value)}`
    );
    if (!res.ok) throw new Error(`Server returned status ${res.status}`);
    const data = await res.json();
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

const table = useVueTable({
  data: computed(() => users.value),
  columns,
  getCoreRowModel: getCoreRowModel(),
});

const openUserDrawer = (user: User) => {
  selectedUser.value = user;
  isDrawerOpen.value = true;
}

</script>

<template>
  <div class="space-y-4 px-4 md:px-6 lg:px-8 py-6">
    <div class="flex justify-end">
      <DebounceSearch v-model:search="search" placeholder="Search by email..." />
    </div>

    <div v-if="error" class="text-red-400 text-sm text-center">
      {{ error }}
    </div>

    <div class="rounded-sm border border-gray-700 overflow-auto">
      <Table class="divide-y divide-gray-800">
        <TableHeader>
          <TableRow>
            <TableHead v-for="header in table.getHeaderGroups()[0].headers" :key="header.id">
              <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody class="divide-y divide-gray-800">
          <template v-if="loading">
            <TableRow v-for="i in rowsPerPage" :key="'loading-' + i" class="animate-pulse py-4">
              <TableCell v-for="n in columns.length" :key="n">
                <div class="h-4 rounded w-full bg-gray-700"></div>
              </TableCell>
            </TableRow>
          </template>

          <template v-else-if="users.length === 0">
            <TableRow class="py-4">
              <TableCell :colspan="columns.length" class="text-center text-gray-400">
                No users found.
              </TableCell>
            </TableRow>
          </template>

          <template v-else>
            <TableRow v-for="row in table.getRowModel().rows" :key="row.id" @click="openUserDrawer(row.original)"
              class="py-4 cursor-pointer">
              <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" class="text-white">
                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <div v-if="!error" class="flex justify-end mt-4">
      <SimplePagination :page="page" :setPage="(p: number) => page = p" :disableBack="page <= 1"
        :disableForward="page >= totalPages" />
    </div>
  </div>
  <!-- drawer -->
  <Drawer v-model:open="isDrawerOpen" v-if="!!selectedUser" class="bg-gray-900">
    <EachUser :selectedUser="selectedUser" />
  </Drawer>
</template>
