<template>
  <div class="bg-gray-950 text-white font-sans min-h-[82vh] flex flex-col">
    <!-- Hero Section -->
    <section class="py-24 px-6 text-center flex-grow">
      <div class="max-w-3xl mx-auto space-y-8">
        <img
          src="../../public/images/landing-image.svg"
          alt="Illustration"
          class="mx-auto w-48 animate-fade-in"
        />
        <h1
          class="text-5xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
        >
          Learn Tech Skills the Smart Way
        </h1>
        <p class="text-gray-300 text-lg sm:text-xl max-w-xl mx-auto">
          Welcome to <span class="text-purple-400 font-semibold">Trideo</span> —
          a modern learning platform where you can watch lessons on React,
          Node.js, Next.js Flutter and more. Learn and build job-ready skills, faster.
        </p>
        <button
          class="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-md"
        >
          Start Learning Now
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="text-white py-6 px-6 text-center">
      <div class="max-w-3xl mx-auto text-base font-medium">
        <p class="flex justify-center items-center gap-2 flex-wrap">
          <span
            >Nyi Wai Yan Tun <span class="text-gray-400">(Romand)</span></span
          >
          <span class="text-gray-500">•</span>
          <a
            href="mailto:nwai39771@gmail.com"
            class="text-purple-400 hover:text-purple-300 hover:underline transition-colors"
          >
            nwai39771@gmail.com
          </a>
        </p>
      </div>
    </footer>

  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 1s ease-out;
}
</style>
