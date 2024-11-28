<script setup lang="ts">
const { src } = defineProps({
  providerId: {
    type: Number,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
});

const imageSrc = computed(() => `${src}?color=white`);
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <NuxtImg
      :src="imageSrc"
      :alt="`Provider ${providerId} logo`"
      class="w-full h-full object-contain group-hover:opacity-80"
    />
  </div>
</template>
