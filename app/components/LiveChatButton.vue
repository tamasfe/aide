<script setup lang="ts">
import type { BaseButtonProps } from "./base/Button.vue";

const props = defineProps<BaseButtonProps>();

const loaded = ref(false);
const nuxtApp = useNuxtApp();
const openIntent = ref(false);

nuxtApp.hook(
  "frontend:commands:modals:live-chat-is-ready",
  () => {
    loaded.value = true;
  },
);

nuxtApp.hook(
  "frontend:commands:modals:close-live-chat",
  () => {
    openIntent.value = false;
  },
);

function onClick() {
  openIntent.value = true;
}

watch(
  [openIntent, loaded],
  ([intent, loaded]) => {
    if (intent && loaded) {
      nuxtApp.callHook("frontend:commands:modals:open-live-chat");
    }
  },
);
</script>

<template>
  <BaseButton v-bind="props" @click="onClick">
    <BaseSpinner v-if="!loaded" class="w-5 h-5" />
    <slot v-else />
  </BaseButton>
</template>
