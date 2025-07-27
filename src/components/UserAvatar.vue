<script setup lang="ts">
import { ref } from 'vue'
import { User, Mail, Calendar, Shield, LogOut } from 'lucide-vue-next'
import { formatDate } from '@/utils/formatDate'
import { handleSignOut } from '@/utils/handle-signout';
import { useRouter } from 'vue-router';

const props = defineProps<{
  profileUrl?: string
  username?: string
  userEmail?: string
  joinedAt?: string
  userRole?: string
}>()

const router = useRouter();
const imageError= ref(false);
const showUserInfo = ref(false)

function toggleUserInfo() {
  showUserInfo.value = !showUserInfo.value
}

const handleImageError= ()=>{
  imageError.value= true;
}

</script>

<template>
  <div class="relative inline-block text-left" @click="toggleUserInfo">
    <!-- Avatar or Fallback Initial -->
    <template v-if="profileUrl &&  !imageError">
      <img
        :src="profileUrl"
        loading="lazy"
        alt="User Avatar"
        class="w-8 h-8 rounded-full object-cover border border-gray-600 cursor-pointer"
        @error="handleImageError"
      />
    </template>
    <template v-else>
      <div
        class="w-8 h-8 rounded-full bg-purple-600 border border-gray-600 flex items-center justify-center text-white font-semibold uppercase cursor-pointer"
      >
        {{ username?.charAt(0) || '?' }}
      </div>
    </template>

    <!-- Dropdown Info Panel -->
    <transition name="fade">
  <div
    v-if="showUserInfo"
    class="absolute top-full right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded shadow-lg text-gray-200 z-50 py-3"
    @click.stop
  >
    <!-- Header: Username -->
    <div
      class="px-4 py-2 border-b border-gray-700 flex items-center space-x-2 text-sm hover:bg-gray-700 hover:text-white cursor-pointer"
    >
      <User class="w-4 h-4" />
      <span class="truncate">{{ username }}</span>
    </div>

    <!-- Info list -->
    <ul class="mt-2 space-y-2 px-4 text-sm border-b border-gray-700 pb-2">
      <li
        class="flex items-center space-x-2 hover:bg-gray-700 hover:text-white px-2 py-1 rounded cursor-pointer"
      >
        <Mail class="w-4 h-4" />
        <span class="truncate">{{ userEmail }}</span>
      </li>
      <li
        class="flex items-center space-x-2 hover:bg-gray-700 hover:text-white px-2 py-1 rounded cursor-pointer"
      >
        <Calendar class="w-4 h-4" />
        <span>Joined at: {{ formatDate(joinedAt) }}</span>
      </li>
      <li
        class="flex items-center space-x-2 hover:bg-gray-700 hover:text-white px-2 py-1 rounded cursor-pointer"
      >
        <Shield class="w-4 h-4" />
        <span>Role: {{ userRole }}</span>
      </li>
    </ul>

    <!-- Logout -->
    <div
      class="mt-2 flex items-center space-x-2 text-sm px-4 py-2 hover:bg-gray-700 hover:text-white cursor-pointer"
      @click="handleSignOut(router)"
    >
      <LogOut class="w-4 h-4" />
      <span>Logout</span>
    </div>
  </div>
</transition>

  </div>
</template>
