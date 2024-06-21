<script setup lang="ts">
import {
  PhMagnifyingGlass,
  PhList,
  PhLightning,
  PhHeadphones,
  PhGift,
} from "@phosphor-icons/vue";
</script>

<template>
  <div
    class="block sm:hidden sticky bottom-0 left-0 w-full bg-subtle text-subtle"
  >
    <div
      class="flex items-center justify-between pt-2 px-4 pb-1 text-subtle font-bold"
    >
      <div class="inline-flex flex-col justify-center items-center">
        <PhList :size="24" />
        <p>Menu</p>
      </div>
      <div class="inline-flex flex-col justify-center items-center">
        <PhLightning :size="24" />
        <p>Hot</p>
      </div>
      <div class="inline-flex flex-col justify-center items-center">
        <PhMagnifyingGlass :size="24" />
        <p>Search</p>
      </div>
      <div class="inline-flex flex-col justify-center items-center">
        <PhHeadphones :size="24" />
        <p>Support</p>
      </div>
      <div class="inline-flex flex-col justify-center items-center">
        <PhGift :size="24" />
        <p>Promos</p>
      </div>
    </div>
  </div>
</template>
