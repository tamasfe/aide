<script setup lang="ts">
// DESIGN STATUS:       ✴️
//   * icon / user color is a little too similar, might need a new CSS var
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const { $dependencies } = useNuxtApp();

const emit = defineEmits([
  "click:menu",
]);

const items = [
  { icon: "lucide:menu", text: "mobile_nav.menu", onClick: () => emit("click:menu") },
  { icon: "lucide:flame", text: "mobile_nav.hot", onClick: () => {} },
  { icon: "lucide:search", text: "mobile_nav.search", onClick: () => $dependencies.users.ui.emitCommandOpenUserActionModal.handle("search") },
  { icon: "lucide:message-circle-question", text: "mobile_nav.support", onClick: () => {} },
  { icon: "lucide:trophy", text: "mobile_nav.promos", onClick: () => {} },
];
</script>

<template>
  <div class="sticky z-[10] sm:hidden bottom-0 left-0 w-full bg-default text-subtle">
    <div class="pt-2.5 px-4 pb-2 flex items-center justify-between">
      <BaseButton
        v-for="item in items"
        :key="item.text"
        variant="ghost"
        size="ghost"
        class="flex flex-col justify-center items-center outline-none"
        @click="item.onClick"
      >
        <BaseIcon
          :name="item.icon"
          class="text-subtle"
          :size="24"
        />
        <div class="text-[0.8rem] text-subtle-light font-semibold">{{ $t(item.text) }}</div>
      </BaseButton>
    </div>
  </div>
</template>
