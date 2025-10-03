<script setup lang="ts">
// DESIGN STATUS:        ✅
//   * lock scroll when fullscreen: import { useScrollLock } from "@vueuse/core"
// ARCHITECTURE STATUS:  ✅

const siteStore = useSiteStore();

const fullScreen = defineModel<boolean>("fullscreen", {
  default: false,
});
const isPlaying = ref(false);

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
        @click="isPlaying = true"
      >
        <BaseIcon
          name="lucide:play"
          :size="20"
        />
        {{ $t("button.play_now") }}
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
        v-model:playing="isPlaying"
        class="w-full h-full"
        :game-identifier="gameIdentifier"
        client-type="desktop"
      />
    </div>
  </div>
</template>
