<script lang="ts" setup>
import { LiveChatWidget, type EventHandlerPayload } from "@livechat/widget-vue";

/**
 * In order to prevent big initial bundle sizes, this component should be imported dynamically, and only in the client side.
 * More info on lazy loading components: https://nuxt.com/docs/guide/directory-structure/components#dynamic-imports
 *
 * The license number was taken from: https://my.livechatinc.com/settings/code
 */

const { $dependencies } = useNuxtApp();
const { locale } = useI18n();

const visibility = ref<"minimized" | "maximized" | "hidden">("hidden");
const emit = defineEmits<{
  (e: "visibility-changed", visibility: "minimized" | "maximized" | "hidden"): void;
}>();

$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-live-chat",
  () => visibility.value = "maximized",
);

$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:close-live-chat",
  () => visibility.value = "hidden",
);

function onVisibilityChanged(event: EventHandlerPayload<"onVisibilityChanged">) {
  switch (event.visibility) {
    case "maximized":
    case "hidden":
      emit("visibility-changed", event.visibility);
      break;

    case "minimized":
      visibility.value = "hidden";
      emit("visibility-changed", "hidden");
      break;
  }
}
</script>

<template>
  <ClientOnly>
    <LiveChatWidget
      :lang="locale"
      license="15201087"
      :visibility="visibility"
      @visibility-changed="onVisibilityChanged"
    />
  </ClientOnly>
</template>
