<script setup lang="ts">
import {
  PhMagnifyingGlass,
  PhList,
  PhLightning,
  PhHeadphones,
  PhGift,
} from "@phosphor-icons/vue";

const { t } = useI18n();

const items = [
  { icon: PhList, text: "mobile_nav.menu" },
  { icon: PhLightning, text: "mobile_nav.hot" },
  { icon: PhMagnifyingGlass, text: "mobile_nav.search" },
  { icon: PhHeadphones, text: "mobile_nav.support" },
  { icon: PhGift, text: "mobile_nav.promos" },
];
</script>

<template>
  <div
    class="giro__mobile-menu block z-10 sm:hidden sticky bottom-0 left-0 w-full bg-default text-subtle"
  >
    <div
      class="flex items-center text-[0.8rem] justify-between pt-2.5 px-4 pb-2 text-subtle-light font-semibold"
    >
      <button
        v-for="item in items"
        :key="item.text"
        class="flex flex-col justify-center items-center outline-none"
        type="button"
      >
        <component
          :is="item.icon"
          class="text-subtle"
          :size="24"
        />
        <p>{{ t(item.text) }}</p>
      </button>
    </div>
  </div>
</template>
