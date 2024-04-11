<template>
  <div class="flex justify-start">
    <div class="flex relative rounded-full px-3 py-2 bg-[#2F323C] text-white font-semibold font-montserrat text-sm hover:brightness-90  transition-all cursor-pointer">
      <img
        class="w-[14px] mr-2"
        :src="icon"
      >
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  }
})
</script>