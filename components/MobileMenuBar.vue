<template>
  <div class="fixed place-content-between bottom-0 left-0 flex md:hidden items-center w-full bg-[#2F323C] z-[998] h-[60px] p-[10px]">
    <NuxtLink
      to="/"
      class="flex flex-col items-center"
    >
      <img
        src="/icons/menu-burger.svg"
        class="w-[24px] mb-1"
      >
      <span class="text-xs font-montserrat font-semibold text-white">Menu</span>
    </NuxtLink>
    <NuxtLink
      to="/"
      class="flex flex-col items-center"
    >
      <img
        src="/icons/hot.svg"
        class="w-[24px] mb-1"
      >
      <span class="text-xs font-montserrat font-semibold text-white">Hot</span>
    </NuxtLink>
    <NuxtLink
      to="/"
      class="flex flex-col items-center"
    >
      <img
        src="/icons/search-mobile.svg"
        class="w-[24px] mb-1"
      >
      <span class="text-xs font-montserrat font-semibold text-white">Search</span>
    </NuxtLink>
    <NuxtLink
      to="/"
      class="flex flex-col items-center"
    >
      <img
        src="/icons/messages.svg"
        class="w-[24px] mb-1"
      >
      <span class="text-xs font-montserrat font-semibold text-white">Support</span>
    </NuxtLink>
    <NuxtLink
      to="/"
      class="flex flex-col items-center"
    >
      <img
        src="/icons/gift.svg"
        class="w-[24px] mb-1"
      >
      <span class="text-xs font-montserrat font-semibold text-white">Promos</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
</script>
