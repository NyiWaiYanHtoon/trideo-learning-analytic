<script setup lang="ts">
import { ref } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const loading = ref(false);
const error = ref("");

const handleGoogleLogin = async () => {
  try {
    loading.value = true;
    error.value = "";
    window.location.href = `${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/auth/google`;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="bg-white shadow-md rounded-xl p-8 max-w-sm w-full">
      <h2 class="text-2xl font-semibold text-center text-purple-800 mb-6">
        Sign in with Google
      </h2>

      <button
        @click="handleGoogleLogin"
        :disabled="loading"
        class="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-lg py-2.5 transition disabled:opacity-50"
      >
        <FontAwesomeIcon :icon="faGoogle" class="w-5 h-5" />
        Continue with Google
      </button>

      <div v-if="error" class="mt-4 text-sm text-red-500 text-center">
        {{ error }}
      </div>
    </div>
  </div>
</template>
