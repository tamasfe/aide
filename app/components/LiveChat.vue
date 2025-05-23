<script lang="ts" setup>
import { LiveChatWidget, type EventHandlerPayload } from "@livechat/widget-vue";

/**
 * In order to prevent big initial bundle sizes, this component should be imported dynamically, and only in the client side.
 * More info on lazy loading components: https://nuxt.com/docs/guide/directory-structure/components#dynamic-imports
 *
 * The license number was taken from: https://my.livechatinc.com/settings/code
 */

const { $dependencies } = useNuxtApp();
const userStore = useUserStore();

const visibility = ref<"minimized" | "maximized" | "hidden">("hidden");
const emit = defineEmits<{
  (e: "visibility-changed", visibility: "minimized" | "maximized" | "hidden"): void;
}>();

$dependencies.common.asyncMessagePublisher.subscribe(
  "frontend:commands:modals:open-live-chat",
  () => visibility.value = "maximized",
);

$dependencies.common.asyncMessagePublisher.subscribe(
  "frontend:commands:modals:close-live-chat",
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

const sessionVariables = computed(() => {
  if (!userStore.user) return {};
  return {
    customerId: userStore.user.id,
    customerPhone: `+${userStore.user.phone.code.value}${userStore.user.phone.national.value}`,
    customerLocale: userStore.user.locale,
    customerTimeZone: userStore.user.timeZone,
    customerUsername: userStore.user.username,
  };
});
</script>

<template>
  <ClientOnly>
    <LiveChatWidget
      license="15201087"
      :visibility="visibility"
      :customer-email="userStore.user?.email"
      :customer-name="userStore.user?.name"
      :session-variables="sessionVariables"
      @visibility-changed="onVisibilityChanged"
    />
  </ClientOnly>
</template>
