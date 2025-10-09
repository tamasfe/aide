<script setup lang="ts">
import type { Game } from "~/modules/games/domain/Game";

// DESIGN STATUS:        ✅
//   * lock scroll when playing: import { useScrollLock } from "@vueuse/core"
// ARCHITECTURE STATUS:  ✴️
//   * If clicking "Play" or "Vote" when not logged in, you need to show modal popup

const siteStore = useSiteStore();
const { $dependencies } = useNuxtApp();
const userStore = useUserStore();
const walletStore = useWalletStore();

defineProps<{
  game: Game;
}>();

const isPlayingRealGame = ref(false);
const isPlayingDemo = ref(false);
const isPlaying = computed({
  get: () => isPlayingRealGame.value || isPlayingDemo.value,
  set: (val: boolean) => {
    if (val === false) {
      isPlayingRealGame.value = false;
      isPlayingDemo.value = false;
      return;
    }
    throw new Error("Cannot set isPlaying to true directly, use isPlayingRealGame or isPlayingDemo");
  },
});
const showDemoButton = ref(false);
const url = useRequestURL();

const listenerId = ref<number | null>(null);
onMounted(() => {
  listenerId.value = $dependencies.common.asyncMessagePublisher.subscribe(
    "frontend:commands:modals:open-user-interaction-modal",
    () => {
      isPlaying.value = false;
    },
  );
});

onUnmounted(() => {
  if (listenerId.value) {
    $dependencies.common.asyncMessagePublisher.unsubscribe(listenerId.value);
    listenerId.value = null;
  }
});
</script>

<template>
  <div v-if="!isPlaying" class="w-full h-full flex flex-col sm:flex-row items-center justify-start p-6 gap-6 relative overflow-hidden">
    <div class="absolute -z-10 top-0 left-0 w-full h-full bg-default/85 backdrop-blur-2xl" />
    <GameImage
      :identifier="game.identifier"
      class="w-[200px] xs:w-auto sm:max-w-44 rounded overflow-hidden flex-grow-0"
    />
    <div class="flex-grow flex flex-col gap-1">
      <h2 class="text-2xl text-center font-semibold">{{ game.name }}</h2>
      <div class="mt-4 flex items-center gap-3">
        <GameFrameVotes
          :authenticated="userStore.user !== null"
          class="gap-4 text-subtle-light"
          :game-identifier="game.identifier"
        />
        <ButtonShare
          :subject="$t('play.share_subject')"
          :body="$t('play.share_body', { game: game.name })"
          :url="url.toString()"
          class="text-subtle-light"
        />
      </div>

      <BaseButton
        variant="primary"
        size="xl"
        class="mt-6 max-w-64 gap-3"
        @click="isPlayingRealGame = true"
      >
        <BaseIcon
          name="lucide:play"
          :size="20"
        />
        {{ $t("button.play_now") }}
      </BaseButton>
      <BaseButton
        v-if="showDemoButton"
        variant="secondary"
        size="xl"
        class="mt-6 max-w-64 gap-3"
        @click="isPlayingDemo = true"
      >
        <BaseIcon
          name="lucide:banknote-x"
          :size="20"
        />
        {{ $t("button.play_now_demo") }}
      </BaseButton>
    </div>
  </div>

  <div
    v-show="isPlaying"
    class="w-full h-full fixed inset-0 z-[11] bg-subtle"
  >
    <div class="bg-subtle flex items-center justify-between w-full flex-shrink-0 flex-grow-0">
      <BaseButton variant="ghost" class="px-4" @click="isPlaying = false">
        <NuxtImg
          class="h-5"
          :src="siteStore.getRelativeAssetPath('logos/logo.svg')"
          alt="Logo"
        />
      </BaseButton>
      <div class="flex items-center gap-4">
        <BaseButton
          v-if="walletStore.wallet"
          id="app-header-deposit-button"
          variant="emphasis"
          class="my-2"
          @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('deposit')"
        >
          {{ $t("button.deposit") }}
        </BaseButton>
        <BaseClose
          class="px-4"
          size="sm"
          @close="isPlaying = false"
        />
      </div>
    </div>

    <GameFrameLauncher
      v-model:playing="isPlayingRealGame"
      class="h-[90vh]"
      :game-identifier="game.identifier"
      client-type="mobile"
    />
    <GameFrameLauncherDemo
      v-if="game.demo"
      v-model:playing="isPlayingDemo"
      class="h-[90vh]"
      :game-identifier="game.identifier"
      client-type="mobile"
      @available="showDemoButton = true"
      @unavailable="showDemoButton = false"
    />
  </div>
</template>
