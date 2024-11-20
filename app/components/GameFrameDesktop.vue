<script setup lang="ts">
// DESIGN STATUS:        ✅
//   * lock scroll when fullscreen: import { useScrollLock } from "@vueuse/core"
// ARCHITECTURE STATUS:  ✅

const fullScreen = ref(false);

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
  authenticated: {
    type: Boolean,
    required: true,
  },
  iFrameUrl: {
    type: String,
    required: false,
  },
});

const onToggleFullScreen = () => {
  fullScreen.value = !fullScreen.value;
};
</script>

<template>
  <div class="flex flex-col rounded-default">
    <GameFrameBackdrop
      :game-id="gameId"
      :authenticated="authenticated"
      :replace="true"
      class="h-[70vh] rounded-t-default"
    >
      <template #authenticated>
        <div
          :class="cn(
            'w-full h-full',
            fullScreen && 'fixed top-0 left-0 z-[11] bg-subtle',
          )"
        >
          <div
            v-if="fullScreen"
            class="p-0 bg-subtle"
          >
            <div class="p-5 bg-subtle">
              <BaseClose
                class="p-0 pr-2"
                @close="onToggleFullScreen"
              />
            </div>
          </div>
          <GameFrameIframe :game-id="gameId" :i-frame-url="iFrameUrl" />
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

    <div class="rounded-b-default bg-subtle p-3 md:p-4 lg:px-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <div class="w-full flex justify-between md:justify-start flex-row md:flex-col items-center md:items-start font-semibold">
          <h2 class="text-lg md:text-xl font-semibold">{{ gameTitle }}</h2>
          <!-- <h3 class="text-subtle-light">Pragmatic Play</h3> -->
        </div>
        <div class="w-full flex justify-between md:justify-end items-center space-x-8 text-subtle font-semibold">
          <ButtonShare
            :subject="$t('play.share_subject')"
            :body="$t('play.share_body')"
            class="hover:text-subtle-light"
          />

          <GameFrameVotes :game-id="gameId" />

          <BaseButton
            v-if="authenticated"
            variant="ghost"
            size="ghost"
            class="flex flex-row gap-1 items-center hover:text-subtle-light"
            @click="onToggleFullScreen"
          >
            <BaseIcon
              name="lucide:maximize"
              :size="24"
            />
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
