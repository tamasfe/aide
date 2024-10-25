<script setup lang="ts">
defineProps({
  iFrameUrl: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <iframe
    :src="iFrameUrl"
    loading="eager"
    width="100%"
    height="100%"
    frameborder="0"
    marginwidth="0"
    marginheight="0"
    class="block border-0"
  />
</template>
