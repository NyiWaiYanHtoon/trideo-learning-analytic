<script setup lang="ts">
import { getUser, type TUser } from "@/utils/get-user";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserAvatar from "./UserAvatar.vue";
import { interval } from "date-fns";

const router = useRouter();

const user = ref<TUser|null>(null);
const username = ref<string | undefined>("");
const profileUrl = ref<string | undefined>("");
const userRole = ref<string | undefined>("");
const userEmail = ref<string | undefined>("");
const joinedAt = ref<string | undefined>();
const loading = ref(true);

const showUserInfo = ref(false);

onMounted(async () => {
    try {
      const fetchedUser = await getUser();
      if (fetchedUser) {
        user.value = fetchedUser;
        username.value = fetchedUser.username;
        profileUrl.value = fetchedUser?.photoUrl;
        userRole.value = fetchedUser.dbUser.role;
        userEmail.value = fetchedUser.dbUser.email;
        joinedAt.value = fetchedUser.dbUser.joinedAt;
      }
    } catch (err) {
      console.error("Failed to load user:", err);
    } finally {
      loading.value = false;
    }
});

const toggleUserInfo = () => {
  showUserInfo.value = !showUserInfo.value;
};

const onClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest("#user-avatar-container")) {
    showUserInfo.value = false;
  }
};
document.addEventListener("click", onClickOutside);

const handleSignIn = () => {
  router.push("Auth");
};
const goToDashboard = () => {
  router.push("/admin/analytics");
};

</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 text-white px-6 md:px-12 py-3 flex items-center justify-between shadow-[0_1px_0_0_rgba(255,255,255,0.08)]"
  >
    <!-- Logo -->
    <router-link
      :to="{ name: 'LandingPage' }"
      class="flex items-center space-x-3"
    >
      <h1
        class="text-xl md:text-2xl font-bold tracking-wide bg-gradient-to-r from-purple-400 via-purple-600 to-indigo-500 bg-clip-text text-transparent"
      >
        Trideo Learning
      </h1>
    </router-link>

    <!-- Right side controls -->
    <div class="flex items-center gap-6 relative">
      <button
        v-if="!loading && userRole"
        @click="goToDashboard"
        class="bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 text-white text-xs rounded-sm px-4 py-1 border border-purple-300 cursor-pointer"
      >
        Go to admin dashboard
      </button>

      <!-- Sign In -->
      <button
        v-else-if="!loading && !user"
        @click="handleSignIn"
        class="px-4 py-1.5 rounded-md border border-[#333] bg-gradient-to-r from-[#1f1f1f] to-[#191919] text-white text-sm font-medium hover:text-purple-400 hover:from-[#252525] hover:to-[#1f1f1f] cursor-pointer transition-colors text-xs"
      >
        Sign In
      </button>

      <div
        v-if="!loading && user"
        id="user-avatar-container"
        class="flex items-center cursor-pointer select-none"
        @click.stop="toggleUserInfo"
      >
        <!-- Avatar -->
        <UserAvatar
          :profileUrl="profileUrl"
          :joinedAt="joinedAt"
          :userRole="userRole"
          :userEmail="userEmail"
          :username="username"
        />
      </div>

      <div v-if="loading" class="flex items-center gap-5">
          <div class="h-8 w-24 rounded-sm bg-gray-800 animate-pulse"></div>
          <div class="h-9 w-9 rounded-full bg-gray-800 animate-pulse"></div>
      </div>
    
    </div>
  </nav>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
