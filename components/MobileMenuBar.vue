<template>
  <div class="fixed place-content-between bottom-0 left-0 flex md:hidden items-center w-full bg-mobile-bottom-menu z-[999] h-[60px] p-[10px]">
    <NuxtLink
      to="/"
      class="flex flex-col items-center w-[50px]"
      @click.prevent="onMenuClick('menu')"
    >
      <img
        src="/icons/menu-burger.svg"
        class="w-[24px] mb-1"
      >
      <span class="text-xs font-montserrat font-semibold text-white">Menu</span>
    </NuxtLink>
    <NuxtLink
      to="/"
      class="flex flex-col items-center w-[50px]"
    >
      <img
        src="/icons/hot.svg"
        class="w-[24px] mb-1"
      >
      <span class="text-xs font-montserrat font-semibold text-white">Hot</span>
    </NuxtLink>
    <NuxtLink
      to="/"
      class="flex flex-col items-center w-[50px]"
      @click.prevent="onMenuClick('search')"
    >
      <img
        src="/icons/search-mobile.svg"
        class="w-[24px] mb-1"
      >
      <span class="text-xs font-montserrat font-semibold text-white">Search</span>
    </NuxtLink>
    <NuxtLink
      to="/"
      class="flex flex-col items-center w-[50px]"
    >
      <img
        src="/icons/messages.svg"
        class="w-[24px] mb-1"
      >
      <span class="text-xs font-montserrat font-semibold text-white">Support</span>
    </NuxtLink>
    <NuxtLink
      to="/"
      class="flex flex-col items-center w-[50px]"
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
const store = useTriggersStore();

const onMenuClick = (type: string) => {
  const currentType = store.getSideMenuType

  if(currentType === type) {
    store.setSideMenuState(!store.getShowSideMenu);
  } else {
    store.setSideMenuType(type);
    store.getShowSideMenu ? store.setSideMenuState(true) : store.setSideMenuState(!store.getShowSideMenu);
  }
}
</script>
