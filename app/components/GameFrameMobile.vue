<script setup lang="ts">
// DESIGN STATUS:        ✅
// ARCHITECTURE STATUS:  ✴️
//   * If clicking "Play" when not logged in, you need to show modal popup

const authenticated = ref(false);
const playing = ref(false);

const onTogglePlaying = () => {
  playing.value = !playing.value;
};
</script>

<template>
  <div class="flex flex-col">
    <GameFrameBackdrop
      :authenticated="authenticated"
    >
      <template #authenticated>
        <div class="absolute top-0 left-0 w-full h-full z-[10]">
          <div class="p-4">
            <div @click="onTogglePlaying">close</div>
          </div>

          <GameFrameIframe />
        </div>
      </template>

      <div
        class="w-full p-6 flex flex-col justify-between gap-6"
      >
        <div class="w-full flex flex-row items-center justify-start gap-6">
          <ImageRatio
            src="/assets/images/games/3.png"
            class="w-[32%] rounded-default"
          />
          <div class="flex flex-col gap-1">
            <h2 class="text-2xl font-semibold">Potion Spells</h2>
            <h3 class="text-lg text-subtle-light font-medium">Pragmatic Play</h3>
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
            >
              <Icon
                name="lucide:play"
                size="20"
              />
              {{ $t("button.play_now") }}
            </BaseButton>
          </div>
        </div>
      </div>
    </GameFrameBackdrop>
  </div>
</template>
