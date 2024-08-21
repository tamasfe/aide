<script setup lang="ts">
const { t } = useI18n();

// DESIGN STATUS:       ✴️
//   * icon / user color is a little too similar, might need a new CSS var
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const items = [
  { icon: "lucide:menu", text: "mobile_nav.menu" },
  { icon: "lucide:flame", text: "mobile_nav.hot" },
  { icon: "lucide:search", text: "mobile_nav.search" },
  { icon: "lucide:message-circle-question", text: "mobile_nav.support" },
  { icon: "lucide:trophy", text: "mobile_nav.promos" },
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
        <Icon
          :name="item.icon"
          class="text-subtle"
          size="24"
        />
        <div>{{ t(item.text) }}</div>
      </button>
    </div>
  </div>
</template>
