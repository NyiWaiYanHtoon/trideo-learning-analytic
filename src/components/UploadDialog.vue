<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Upload, AlertTriangle, Loader2 } from "lucide-vue-next";
import { POSITION, useToast } from "vue-toastification";

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: "update:show", value: boolean): void;
}>();

const toast = useToast();

const title = ref("");
const description = ref("");
const selectedFile = ref<File | null>(null);
const thumbnailFile = ref<File | null>(null);
const errorMsg = ref("");
const isDragging = ref(false);
const tags = ref("");
const category = ref("");
const loading = ref(false);

const categories = ref<{ id: string; name: string }[]>([]);

onMounted(async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/categories`
    );

    if (!res.ok) throw new Error("Failed to fetch categories");

    const data = await res.json();
    categories.value = data.categories;
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
});

const handleDrop = (e: DragEvent) => {
  e.preventDefault();
  isDragging.value = false;
  errorMsg.value = "";
  const files = e.dataTransfer?.files;
  if (!files?.length) return;

  const file = files[0];
  if (!file.type.startsWith("video/")) {
    errorMsg.value = "Invalid file type";
    selectedFile.value = null;
    return;
  }

  selectedFile.value = file;
};

const handleFileChange = (e: Event) => {
  errorMsg.value = "";
  const files = (e.target as HTMLInputElement).files;
  if (!files?.length) return;

  const file = files[0];
  if (!file.type.startsWith("video/")) {
    errorMsg.value = "Invalid file type. Please upload a video file.";
    selectedFile.value = null;
    return;
  }

  selectedFile.value = file;
};

const handleThumbnailChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files?.length) return;

  const file = files[0];
  if (!file.type.startsWith("image/")) {
    alert("Invalid thumbnail file. Please upload an image.");
    return;
  }

  thumbnailFile.value = file;
};

const handleUpload = async () => {
  if (
    !selectedFile.value ||
    !thumbnailFile.value ||
    !title.value ||
    !description.value
  ) {
    alert("Please select a valid video file and thumbnail image.");
    return;
  }

  loading.value = true;

  // 1. Extract duration from selected video file
  const video = document.createElement("video");
  video.preload = "metadata";

  video.onloadedmetadata = async () => {
    window.URL.revokeObjectURL(video.src);
    const duration = video.duration;

    // 2. Append all form data including duration
    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("description", description.value);
    formData.append("video", selectedFile.value!);
    formData.append("thumbnail", thumbnailFile.value!);
    formData.append("tags", tags.value);
    formData.append("category", category.value);
    formData.append("duration", duration.toString());

    try {
      const response = await fetch(
        `${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/videos`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Something went wrong!");
      toast.success("Video uploaded successfully!", {
        position: POSITION.TOP_RIGHT,
      });
      emit("update:show", false);
      // reset fields
      title.value = "";
      description.value = "";
      selectedFile.value = null;
      thumbnailFile.value = null;
      tags.value = "";
      category.value = "";
    } catch (error) {
      console.error(error);
      toast.error("Upload failed!", { position: POSITION.TOP_RIGHT });
    } finally {
      loading.value = false;
    }
  };

  video.src = URL.createObjectURL(selectedFile.value);
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
  >
    <div
      class="bg-[#212121] text-white w-full max-w-xl p-6 rounded-2xl relative"
    >
      <button
        class="absolute top-3 right-4 text-2xl text-white hover:text-gray-300"
        @click="emit('update:show', false)"
        :disabled="loading"
      >
        &times;
      </button>

      <form @submit.prevent="handleUpload" class="space-y-2">
        <!-- Video Upload -->
        <div
          class="flex flex-col items-center p-6 transition-colors border-2 border-dashed rounded-xl mt-5"
          :class="
            isDragging
              ? 'border-blue-500 bg-[#2a2a2a]'
              : 'border-gray-600 bg-[#2a2a2a]'
          "
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop="handleDrop"
        >
          <div
            class="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors"
            :class="isDragging ? 'bg-blue-600' : 'bg-[#333]'"
          >
            <svg
              v-if="loading"
              xmlns="http://www.w3.org/2000/svg"
              class="w-10 h-10 text-gray-300 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
            <Upload v-else-if="!loading" class="w-10 h-10 text-gray-300" />
          </div>

          <h3 class="text-lg font-medium mb-1">
            Drag and drop video files to upload
          </h3>
          <p class="text-sm text-gray-400 mb-4">
            Your videos will be private until you publish them.
          </p>

          <p v-if="selectedFile" class="italic text-sm mt-3">
            {{ selectedFile.name }}
          </p>
          <p
            v-if="errorMsg"
            class="text-yellow-500 text-sm mt-2 flex items-center gap-1"
          >
            <AlertTriangle class="w-4 h-4" />
            <span>{{ errorMsg }}</span>
          </p>

          <label
            class="bg-white text-black text-sm px-6 py-2 rounded-full hover:bg-gray-200 cursor-pointer mt-5"
          >
            Select file
            <input
              ref="fileInput"
              type="file"
              accept="video/*"
              class="hidden"
              @change="handleFileChange"
              :disabled="loading"
            />
          </label>
        </div>

        <!-- Title -->
        <div>
          <label class="block mb-1 text-sm font-medium">Title</label>
          <input
            v-model="title"
            type="text"
            class="w-full rounded-lg border border-gray-600 bg-[#2c2c2c] px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Video title"
            :disabled="loading"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block mb-1 text-sm font-medium">Description</label>
          <textarea
            v-model="description"
            rows="3"
            class="w-full rounded-lg border border-gray-600 bg-[#2c2c2c] px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Video description"
            :disabled="loading"
          ></textarea>
        </div>

        <!-- Tags -->
        <div>
          <label class="block mb-1 text-sm font-medium"
            >Tags (comma separated)</label
          >
          <input
            v-model="tags"
            type="text"
            class="w-full rounded-lg border border-gray-600 bg-[#2c2c2c] px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-500"
            placeholder="e.g. travel, summer, vlog"
            :disabled="loading"
          />
        </div>

        <!-- Category -->
        <div>
          <label class="block mb-1 text-sm font-medium">Category</label>
          <select
            v-model="category"
            class="w-full rounded-lg border border-gray-600 bg-[#2c2c2c] px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-500"
            :disabled="loading"
          >
            <option value="" disabled>Select a category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Thumbnail Upload -->
        <div>
          <label class="block mb-2 text-sm font-medium">Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            @change="handleThumbnailChange"
            class="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200"
            :disabled="loading"
          />
        </div>

        <!-- Submit -->
        <div class="flex justify-end pt-2">
          <div class="flex gap-2 items-center">
            <button
              type="button"
              class="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-400"
              @click="emit('update:show', false)"
              :disabled="loading"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
              :disabled="loading"
            >
              Upload
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
