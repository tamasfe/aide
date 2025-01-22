<script setup lang="ts">
// DESIGN STATUS:        ✅
//   * lock scroll when fullscreen: import { useScrollLock } from "@vueuse/core"
// ARCHITECTURE STATUS:  ✅

const fullScreen = defineModel<boolean>("fullscreen", {
  default: false,
});

const { $dependencies } = useNuxtApp();

defineProps({
  gameTitle: {
    type: String,
    required: true,
  },
  gameId: {
    type: Number,
    required: true,
  },
  gameImageUrl: {
    type: String,
    required: true,
  },
  authenticated: {
    type: Boolean,
    required: true,
  },
  iframeUrl: {
    type: String,
    required: false,
  },
});

const onToggleFullScreen = () => {
  fullScreen.value = !fullScreen.value;
};
</script>

<template>
  <div class="flex flex-col">
    <GameFrameBackdrop
      :src="gameImageUrl"
      :authenticated="authenticated"
      :replace="true"
      class="h-[70vh]"
    >
      <template #authenticated>
        <div
          v-if="iframeUrl"
          :class="cn(
            'w-full h-full',
            fullScreen && 'fixed top-0 left-0 z-[11] bg-subtle',
          )"
        >
          <div
            v-if="fullScreen"
            class="p-0 bg-subtle"
          >
            <div class="bg-subtle flex items-center justify-end w-full">
              <BaseClose
                @close="onToggleFullScreen"
              />
            </div>
          </div>
          <GameFrameIframe :game-id="gameId" :i-frame-url="iframeUrl" />
        </div>
        <div
          v-else
          class="flex flex-col items-center justify-center absolute inset-0"
        >
          <BaseSpinner class="text-subtle" :size="32" />
        </div>
      </template>

      <div class="flex flex-col items-center gap-4">
        <IconLogo
          class="w-[14rem]"
        />
        <h1 class="text-lg font-semibold text-center">
          {{ $t("play.login_to_play") }}
        </h1>
        <div class="flex gap-4 w-full">
          <BaseButton
            variant="subtle"
            class="px-8"
            @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('login')"
          >
            {{ $t("button.login") }}
          </BaseButton>
          <BaseButton
            variant="primary"
            class="px-12"
            @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('register')"
          >
            {{ $t("button.register") }}
          </BaseButton>
        </div>
      </div>
    </GameFrameBackdrop>
  </div>
</template>
