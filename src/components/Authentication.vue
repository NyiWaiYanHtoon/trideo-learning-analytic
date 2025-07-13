<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const error = ref('');
const isSignIn = ref(true);

const handleSubmit = () => {
  if (!email.value || !password.value) {
    error.value = 'Please enter both email and password.';
    return;
  }

  if (isSignIn.value) {
    console.log('Signing in with', email.value, password.value);
  } else {
    console.log('Signing up with', email.value, password.value);
  }

  error.value = '';
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
      <h2 class="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
        {{ isSignIn ? 'Sign In' : 'Sign Up' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="text-sm text-red-500 text-center">{{ error }}</div>

        <button
          type="submit"
          class="w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 hover:opacity-90 text-white font-semibold rounded-lg py-2.5 transition"
        >
          {{ isSignIn ? 'Sign In' : 'Sign Up' }}
        </button>

        <div
          class="text-sm text-center mt-4 text-blue-600 cursor-pointer hover:underline"
          @click="isSignIn = !isSignIn"
        >
          {{ isSignIn ? 'Don\'t have an account? Sign Up' : 'Already have an account? Sign In' }}
        </div>
      </form>
    </div>
  </div>
</template>
