<script setup lang="ts">
import type { BaseButtonProps } from "./base/Button.vue";

const props = defineProps<BaseButtonProps>();

const { $dependencies } = useNuxtApp();

const liveChatIsReadyToOpen = ref(false);
const showLoading = ref(false);

$dependencies.common.asyncMessagePublisher.once(
  "frontend:commands:modals:live-chat-is-ready",
  () => liveChatIsReadyToOpen.value = true,
);

function clickOnSlot() {
  if (showLoading.value) {
    return;
  }

  if (liveChatIsReadyToOpen.value) {
    $dependencies.common.asyncMessagePublisher.emit(
      "frontend:commands:modals:open-live-chat",
      {},
    );
    return;
  }

  showLoading.value = true;

  $dependencies.common.asyncMessagePublisher.once(
    "frontend:commands:modals:live-chat-is-ready",
    () => {
      $dependencies.common.asyncMessagePublisher.emit(
        "frontend:commands:modals:open-live-chat",
        {},
      );
      liveChatIsReadyToOpen.value = true;
      showLoading.value = false;
    },
  );
}
</script>

<template>
  <BaseButton v-bind="props" @click="clickOnSlot">
    <BaseSpinner v-if="showLoading" class="w-full" />
    <slot v-else />
  </BaseButton>
</template>
