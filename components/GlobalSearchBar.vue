<template>
  <div class="relative w-full">
    <input
      class="w-full rounded-full bg-[#2F323C] hover:brightness-90 transition-all text-sm font-montserrat text-white font-semibold p-[10px] outline-none pl-[36px] placeholder:text-white placeholder:opacity-80"
      type="text"
      placeholder="Search for an account or provider by name"
      v-model="model"
    >
    <IconsSearchIcon class="absolute left-[10px] top-[12px]"/>
  </div>
</template>

<script setup lang="ts">
const model = defineModel();
</script>