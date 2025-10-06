<script setup lang="ts">
// DESIGN STATUS:        ✅
//   * lock scroll when fullscreen: import { useScrollLock } from "@vueuse/core"
// ARCHITECTURE STATUS:  ✅

const siteStore = useSiteStore();

const fullScreen = defineModel<boolean>("fullscreen", {
  default: false,
});
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
const showDemoButton = useState("show-demo-button-in-desktop", () => false);

defineProps({
  gameTitle: {
    type: String,
    required: true,
  },
  gameIdentifier: {
    type: String,
    required: true,
  },
});

const onToggleFullScreen = () => {
  fullScreen.value = !fullScreen.value;
};
</script>

<template>
  <div
    :class="cn(
      'w-full h-[70vh] bg-subtle flex flex-col items-center justify-center gap-y-6',
    )"
  >
    <template v-if="!isPlaying">
      <NuxtImg
        class="h-10"
        :src="siteStore.getRelativeAssetPath('logos/logo.svg')"
        alt="Logo"
      />
      <h1 class="text-3xl font-semibold text-center">
        {{ gameTitle }}
      </h1>
      <BaseButton
        variant="primary"
        size="xl"
        class="w-full gap-3 max-w-72"
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
    </template>

    <div
      v-show="isPlaying"
      class="w-full h-full"
      :class="
        { 'fixed top-0 left-0 z-[11] bg-subtle h-[90vh]': fullScreen }
      "
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
      <GameFrameLauncher
        v-model:playing="isPlayingRealGame"
        class="w-full h-full"
        :game-identifier="gameIdentifier"
        client-type="desktop"
      />
      <GameFrameLauncherDemo
        v-model:playing="isPlayingDemo"
        class="w-full h-full"
        :game-identifier="gameIdentifier"
        client-type="desktop"
        @demo-is-ready="showDemoButton = true"
      />
    </div>
  </div>
</template>
