<script setup lang="ts">
// DESIGN STATUS:        ✅
//   * lock scroll when playing: import { useScrollLock } from "@vueuse/core"
// ARCHITECTURE STATUS:  ✴️
//   * If clicking "Play" or "Vote" when not logged in, you need to show modal popup

const props = defineProps({
  gameTitle: {
    type: String,
    required: true,
  },
  gameId: {
    type: Number,
    required: true,
  },
  authenticated: {
    type: Boolean,
    required: true,
  },
  iFrameUrl: {
    type: String,
    required: false,
  },
});

const playing = ref(false);

const { $dependencies } = useNuxtApp();

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
  <div class="flex flex-col">
    <GameFrameBackdrop
      :game-id="gameId"
      :authenticated="authenticated"
      :replace="false"
    >
      <template #authenticated>
        <div
          v-if="playing"
          class="fixed top-0 left-0 w-full h-full z-[11]"
        >
          <div class="p-5 bg-subtle">
            <BaseClose
              class="p-0 pr-2"
              @close="onTogglePlaying"
            />
          </div>

          <GameFrameIframe :i-frame-url="iFrameUrl" />
        </div>
      </template>

      <div class="w-full max-w-[35rem] p-6 flex flex-col justify-between gap-6">
        <div class="w-full flex flex-row items-center justify-start gap-6">
          <GamesImageLoader
            :game-id="gameId"
            class="w-[32%] rounded-default"
          />
          <div class="flex flex-col gap-1">
            <h2 class="text-2xl font-semibold">{{ gameTitle }}</h2>
            <!-- <h3 class="text-lg text-subtle-light font-medium">Pragmatic Play</h3> -->
            <GameFrameVotes
              class="mt-4 gap-4 text-subtle-light"
            />
          </div>
        </div>
        <div class="flex flex-row w-full items-center justify-between">
          <div class="w-[32%] flex items-center justify-center">
            <ButtonShare
              :subject="$t('play.share_subject')"
              :body="$t('play.share_body')"
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
