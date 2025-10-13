<script setup lang="ts">
withDefaults(defineProps<{
  title?: string;
}>(), {
  title: "title",
});

const siteStore = useSiteStore();
</script>

<template>
  <div class="h-full w-full flex items-start justify-start border-solid border-blue-500 border-[12px] bg-gray-50">
    <div class="flex items-start justify-start h-full">
      <div class="flex flex-col justify-between w-full h-full">
        <h1 class="text-[80px] p-20 font-black text-left">
          {{ title }}
        </h1>
        <p class="text-2xl pb-10 px-20 font-bold mb-0">
          {{ siteStore.currentDomain.frontend }}
        </p>
      </div>
    </div>
  </div>
</template>
