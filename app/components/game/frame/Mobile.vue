<script setup lang="ts">
const siteStore = useSiteStore();

// DESIGN STATUS:        ✅
//   * lock scroll when playing: import { useScrollLock } from "@vueuse/core"
// ARCHITECTURE STATUS:  ✴️
//   * If clicking "Play" or "Vote" when not logged in, you need to show modal popup

const props = defineProps({
  gameTitle: {
    type: String,
    required: true,
  },
  gameIdentifier: {
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

const playing = ref(false);

const { $dependencies } = useNuxtApp();
const url = useRequestURL();

const onTogglePlaying = async () => {
  if (!props.authenticated) {
    await $dependencies.users.ui.emitCommandOpenUserActionModal.handle("login");
    return;
  }

  // must check if logged in etc, this is just pseudocode to show UI state
  playing.value = !playing.value;
};
</script>

<template>
  <div class="flex flex-col h-full">
    <GameFrameBackdrop
      :game-identifier="gameIdentifier"
      class="h-full"
      :authenticated="authenticated"
      :replace="false"
    >
      <template #authenticated>
        <div
          v-if="playing && iframeUrl"
          class="fixed top-0 left-0 bottom-0 right-0  z-[11] bg-subtle flex flex-col"
        >
          <div class="bg-subtle flex items-center justify-between w-full flex-shrink-0 flex-grow-0 pl-4">
            <NuxtImg
              class="h-5"
              :src="siteStore.getRelativeAssetPath('logos/logo.svg')"
              alt="Logo"
            />
            <BaseClose
              size="sm"
              @close="onTogglePlaying"
            />
          </div>

          <div class="relative flex-grow">
            <GameFrameIframe :game-identifier="gameIdentifier" :i-frame-url="iframeUrl" />
          </div>
        </div>
        <div
          v-if="playing && !iframeUrl"
          class="flex flex-col items-center justify-center absolute inset-0"
        >
          <BaseSpinner class="text-subtle" :size="32" />
        </div>
      </template>

      <div class="w-full max-w-lg p-6 flex flex-col justify-between gap-6">
        <div class="w-full flex flex-row items-center justify-start gap-6">
          <GameImage
            :identifier="gameIdentifier"
            class="w-[32%] rounded"
          />
          <div class="flex flex-col gap-1">
            <h2 class="text-2xl font-semibold">{{ gameTitle }}</h2>
            <GameFrameVotes
              :authenticated="authenticated"
              class="mt-4 gap-4 text-subtle-light"
              :game-identifier="gameIdentifier"
            />
          </div>
        </div>
        <div class="flex flex-row w-full items-center justify-between">
          <div class="w-[32%] flex items-center justify-center">
            <ButtonShare
              :subject="$t('play.share_subject')"
              :body="$t('play.share_body', { game: gameTitle })"
              :url="url.toString()"
              class="text-subtle-light"
            />
          </div>
          <div class="ml-2 flex-grow">
            <BaseButton
              variant="primary"
              size="xl"
              class="w-full gap-2"
              @click="onTogglePlaying"
            >
              <BaseIcon
                name="lucide:play"
                :size="20"
              />
              {{ $t("button.play_now") }}
            </BaseButton>
          </div>
        </div>
      </div>
    </GameFrameBackdrop>
  </div>
</template>
