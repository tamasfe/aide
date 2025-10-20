<script setup lang="ts">
// DESIGN STATUS:       ✴️
//   * icon / user color is a little too similar, might need a new CSS var
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

import { NuxtLink, LiveChatButton } from "#components";

const userModule = useUserModule();
const { t } = useI18n();

const emit = defineEmits([
  "click:menu",
]);

const localePath = useLocalePath();

type NavMobileItem = {
  component: Component | string;
  icon: string;
  text: string;
  attributes?: Record<string, unknown>;
};

const items = computed<NavMobileItem[]>(() => [
  {
    component: "div",
    type: "action",
    icon: "lucide:menu",
    text: t("mobile_nav.menu"),
    attributes: {
      onClick: () => emit("click:menu"),
    },
  },
  {
    component: NuxtLink,
    icon: "lucide:home",
    text: t("mobile_nav.home"),
    attributes: {
      to: localePath({
        name: "index",
      }),
    },
  },
  {
    component: NuxtLink,
    icon: "lucide:flame",
    text: t("mobile_nav.hot"),
    attributes: {
      to: localePath({
        name: "categories-identifier",
        params: { identifier: "hot" },
      }),
    },
  },
  {
    component: "div",
    icon: "lucide:search",
    text: t("mobile_nav.search"),
    attributes: {
      onClick: () => userModule.ui.emitCommandOpenUserActionModal.handle("search"),
    },
  },
  {
    component: LiveChatButton,
    icon: "lucide:message-circle-question",
    text: t("mobile_nav.support"),
    attributes: {
      variant: "ghost",
      size: "ghost",
    },
  },
]);
</script>

<template>
  <div
    class="
      h-14
      fixed
      flex
      z-10
      bottom-0
      left-0
      right-0
      bg-subtle
      text-subtle
      pb-[env(safe-area-inset-bottom)]"
  >
    <component
      :is="item.component"
      v-for="item in items"
      :key="item.text"
      v-bind="item.attributes"
      class="h-full flex-1 flex flex-col justify-center items-center outline-none"
    >
      <BaseIcon
        :name="item.icon"
        class="text-subtle mb-1"
        :size="20"
      />
      <div class="text-subtle text-xs">{{ item.text }}</div>
    </component>
  </div>
</template>
