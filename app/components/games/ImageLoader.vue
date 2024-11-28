<script setup lang="ts">
const { src } = defineProps({
  src: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <NuxtImg
      :src="src"
      alt=""
      class="block w-full h-full object-cover transition-transform transform hover:scale-105 cursor-pointer"
    />
  </div>
</template>
