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
    error.value = "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
    <div class="bg-gray-900 shadow-2xl rounded-2xl p-8 max-w-sm w-full text-white relative">

      <!-- Illustration -->
      <div class="flex justify-center -mt-20 mb-4">
        <img
          src="/images/login-image.avif"
          alt="Illustration"
          class="w-24 h-24 rounded-full border-4 border-purple-600 shadow-lg object-cover bg-gray-800"
        />
      </div>

      <div class="text-center mt-2">
        <h2 class="text-2xl font-bold text-purple-400 mb-1">Welcome to Trideo</h2>
        <p class="text-sm text-gray-400 mb-6">Sign in with your Google account to continue.</p>

        <button
          @click="handleGoogleLogin"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg py-3 transition disabled:opacity-50"
        >
          <FontAwesomeIcon :icon="faGoogle" class="w-5 h-5" />
          <span v-if="!loading">Continue with Google</span>
          <span v-else>Signing in...</span>
        </button>

        <div v-if="error" class="mt-4 text-sm text-red-400 text-center">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>
