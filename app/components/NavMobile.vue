<script setup lang="ts">
// DESIGN STATUS:       ✴️
//   * icon / user color is a little too similar, might need a new CSS var
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const { $dependencies } = useNuxtApp();

const emit = defineEmits([
  "click:menu",
]);

const localePath = useLocalePath();

const items = [
  { icon: "lucide:menu", text: "mobile_nav.menu", onClick: () => emit("click:menu") },
  {
    icon: "lucide:home", text: "mobile_nav.home", onClick: async () => {
      await navigateTo(localePath({
        name: "index",
      }));
    },
  },
  {
    icon: "lucide:flame", text: "mobile_nav.hot", onClick: async () => {
      await navigateTo(localePath({
        name: "categories-id",
        params: { id: "hot" },
      }));
    },
  },
  { icon: "lucide:search", text: "mobile_nav.search", onClick: () => $dependencies.users.ui.emitCommandOpenUserActionModal.handle("search") },
  // { icon: "lucide:trophy", text: "mobile_nav.promos", onClick: () => {} },
];
</script>

<template>
  <div
    class="h-14 fixed z-[10] sm:hidden bottom-0 left-0 right-0 bg-subtle/95 text-subtle pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl"
  >
    <div class="w-full grid items-center h-full" :style="{ gridTemplateColumns: 'repeat(' + (items.length + 1) + ', 1fr)' }">
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
          class="text-subtle mb-1"
          :size="22"
        />
        <div class="text-subtle text-xs">{{ $t(item.text) }}</div>
      </BaseButton>
      <LiveChatButton
        variant="ghost"
        size="ghost"
        class="flex flex-col justify-center items-center outline-none"
      >
        <BaseIcon
          name="lucide:message-circle-question"
          class="text-subtle mb-1"
          :size="22"
        />
        <div class="text-subtle text-xs">{{ $t('mobile_nav.support') }}</div>
      </LiveChatButton>
    </div>
  </div>
</template>
