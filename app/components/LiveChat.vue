<script lang="ts" setup>
import { LiveChatWidget, type EventHandlerPayload } from "@livechat/widget-vue";

/**
 * In order to prevent big initial bundle sizes, this component should be imported dynamically, and only in the client side.
 * More info on lazy loading components: https://nuxt.com/docs/guide/directory-structure/components#dynamic-imports
 *
 * The license number was taken from: https://my.livechatinc.com/settings/code
 */

const userStore = useUserStore();
const nuxtApp = useNuxtApp();

const visibility = ref<"minimized" | "maximized" | "hidden">("hidden");

nuxtApp.hook("frontend:commands:modals:open-live-chat", async () => {
  visibility.value = "maximized";
});

nuxtApp.hook("frontend:commands:modals:close-live-chat", async () => {
  visibility.value = "hidden";
});

function onVisibilityChanged(event: EventHandlerPayload<"onVisibilityChanged">) {
  switch (event.visibility) {
    case "maximized":
      visibility.value = "maximized";
      nuxtApp.callHook("frontend:commands:modals:live-chat-opened");
      break;

    case "hidden":
    case "minimized":
      visibility.value = "hidden";
      nuxtApp.callHook("frontend:commands:modals:live-chat-closed");
      break;
  }
}

function onWidgetIsReady() {
  nuxtApp.callHook("frontend:commands:modals:live-chat-is-ready");
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
      @ready="onWidgetIsReady"
      @visibility-changed="onVisibilityChanged"
    />
  </ClientOnly>
</template>
