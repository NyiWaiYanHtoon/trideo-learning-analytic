<script setup lang="ts">
import { ref } from 'vue'
import { Upload, AlertTriangle } from 'lucide-vue-next'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const title = ref('')
const description = ref('')
const selectedFile = ref<File | null>(null)
const errorMsg = ref('')
const isDragging = ref(false)

// New fields
const tags = ref('') // comma-separated tags string
const category = ref('') // selected category

// Example categories - you can replace with your real categories or fetch dynamically
const categories = ['Education', 'Entertainment', 'Sports', 'Music', 'Technology', 'Other']

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  errorMsg.value = ''
  const files = e.dataTransfer?.files
  if (!files?.length) return

  const file = files[0]
  if (!file.type.startsWith('video/')) {
    errorMsg.value = 'Invalid file type'
    selectedFile.value = null
    return
  }

  selectedFile.value = file
}

const handleFileChange = (e: Event) => {
  errorMsg.value = ''
  const files = (e.target as HTMLInputElement).files
  if (!files?.length) return

  const file = files[0]
  if (!file.type.startsWith('video/')) {
    errorMsg.value = 'Invalid file type. Please upload a video file.'
    selectedFile.value = null
    return
  }

  selectedFile.value = file
}

const handleUpload = async () => {
  if (!selectedFile.value) {
    alert('Please select a valid video file.')
    return
  }

  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('video', selectedFile.value)
  formData.append('tags', tags.value) // add tags
  formData.append('category', category.value) // add category

  try {
    console.log('Uploading:', {
      title: title.value,
      description: description.value,
      file: selectedFile.value,
      tags: tags.value,
      category: category.value,
    })

    alert('Video uploaded successfully!')
    emit('update:show', false) // Close dialog
    // Reset all fields
    title.value = ''
    description.value = ''
    selectedFile.value = null
    tags.value = ''
    category.value = ''
  } catch (error) {
    console.error(error)
    alert('Upload failed.')
  }
}
</script>

<template>
  <!-- Upload Dialog Modal -->
  <div v-if="show" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
    <div class="bg-[#212121] text-white w-full max-w-xl p-6 rounded-2xl relative">
      <!-- Close Button -->
      <button class="absolute top-3 right-4 text-2xl text-white hover:text-gray-300" @click="emit('update:show', false)">
        &times;
      </button>

      <form @submit.prevent="handleUpload" class="space-y-2">
        <!-- Drop Area -->
        <div
          class="flex flex-col items-center p-6 transition-colors border-2 border-dashed rounded-xl mt-5"
          :class="isDragging ? 'border-blue-500 bg-[#2a2a2a]' : 'border-gray-600 bg-[#2a2a2a]'"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop="handleDrop"
        >
          <div
            class="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-colors"
            :class="isDragging ? 'bg-blue-600' : 'bg-[#333]'"
          >
            <Upload class="w-10 h-10 text-gray-300" />
          </div>

          <h3 class="text-lg font-medium mb-1">Drag and drop video files to upload</h3>
          <p class="text-sm text-gray-400 mb-4">Your videos will be private until you publish them.</p>

          <p v-if="selectedFile" class="italic text-sm mt-3">
            {{ selectedFile.name }}
          </p>
          <p v-if="errorMsg" class="text-yellow-500 text-sm mt-2 flex items-center gap-1">
            <AlertTriangle class="w-4 h-4"/>
            <span>{{ errorMsg }}</span>
          </p>

          <label class="bg-white text-black text-sm px-6 py-2 rounded-full hover:bg-gray-200 cursor-pointer mt-5">
            Select file
            <input ref="fileInput" type="file" accept="video/*" class="hidden" @change="handleFileChange" />
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
          ></textarea>
        </div>

        <!-- Tags -->
        <div>
          <label class="block mb-1 text-sm font-medium">Tags (comma separated)</label>
          <input
            v-model="tags"
            type="text"
            class="w-full rounded-lg border border-gray-600 bg-[#2c2c2c] px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-500"
            placeholder="e.g. travel, summer, vlog"
          />
        </div>

        <!-- Category -->
        <div>
          <label class="block mb-1 text-sm font-medium">Category</label>
          <select
            v-model="category"
            class="w-full rounded-lg border border-gray-600 bg-[#2c2c2c] px-3 py-2 text-white focus:outline-none focus:ring focus:border-blue-500"
          >
            <option value="" disabled>Select a category</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>

        <!-- Submit -->
        <div class="flex justify-end pt-2">
          <div class="flex gap-2 items-center">
            <button type="button" class="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-400" @click="emit('update:show', false)">
              Cancel
            </button>
            <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
              Upload
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
