<script setup lang="ts">
import type { HtmlAttributes } from "@unhead/vue";
import type { PropType } from "vue";

const { $dependencies } = useNuxtApp();
const siteStore = useSiteStore();
const i18n = useI18n();

const props = defineProps({
  gameIdentifier: {
    type: String,
    required: true,
  },
  clientType: {
    type: String as PropType<"desktop" | "mobile">,
    required: true,
  },
  class: {
    type: String as PropType<HtmlAttributes["class"]>,
    required: false,
    default: "",
  },
});

const isPlaying = defineModel<boolean>("playing", {
  default: false,
});

const emits = defineEmits<{
  (e: "demo-is-ready"): void;
}>();

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;
const { data: gameSessionResult } = await useAsyncData(() =>
  $dependencies.games.ui.createGameSessionDemoFromGamePage.handle(props.gameIdentifier, i18n.localeProperties.value.language || i18n.locale.value.split("-")[0] || "", props.clientType),
{
  watch: [() => i18n.locale.value],
  lazy: DEFER_CLIENT_SIDE_LOADING,
  server: ENABLE_SERVER_SIDE_RENDERING,
},
);

/**
 * Forces a refresh when user "closes" the game screen as sometimes the pinia store glitches out when user logs in or out (making both user & wallet store change).
 */
watch(() => gameSessionResult.value, async (newValue) => {
  if (newValue && !newValue.isFailure) {
    emits("demo-is-ready");
  }
  return;
});
</script>

<template>
  <template v-if="isPlaying">
    <div
      v-if="!gameSessionResult"
      :class="cn('flex flex-col items-center justify-center absolute inset-0', props.class)"
    >
      <BaseSpinner class="text-subtle" :size="32" />
    </div>
    <template v-else>
      <GameFrameIframe
        v-if="!gameSessionResult.isFailure"
        :class="cn('w-full h-full', props.class)"
        :game-identifier="gameIdentifier"
        :src="gameSessionResult.value.url"
      />

      <div
        v-else
        :class="cn('w-full h-full px-6 bg-subtle flex flex-col items-center justify-center', props.class)"
      >
        <NuxtImg
          class="h-7"
          :src="siteStore.getRelativeAssetPath('logos/logo.svg')"
          alt="Logo"
        />
        <template v-if="gameSessionResult.errorName === 'ErrorGameNotAccessible'">
          <h2 class="mt-6 text-2xl font-semibold">{{ $t("game.game_launcher.error_game_not_accessible_title") }}</h2>
          <p class="text-center">
            {{ $t("game.game_launcher.error_game_not_accessible_message") }}
          </p>
          <div class="mt-6">
            <BaseButton
              id="app-header-deposit-button"
              variant="secondary"
              @click="isPlaying = false"
            >
              {{ $t("button.close") }}
            </BaseButton>
          </div>
        </template>
        <template v-else-if="gameSessionResult.errorName === 'ErrorGameHasNoDemo'">
          <h2 class="mt-6 text-2xl font-semibold">{{ $t("game.game_launcher.error_game_has_no_demo_title") }}</h2>
          <p class="text-center">{{ $t("game.game_launcher.error_game_has_no_demo_message") }}</p>
          <div class="mt-6 flex items-center gap-4">
            <BaseButton
              id="app-header-deposit-button"
              variant="secondary"
              @click="isPlaying = false"
            >
              {{ $t("button.close") }}
            </BaseButton>
          </div>
        </template>
        <template v-else>
          <h2 class="mt-6 text-2xl font-semibold">{{ $t("game.game_launcher.error_generic_title") }}</h2>
          <p class="text-center">
            {{ $t("game.game_launcher.error_generic_message") }}
          </p>
          <div class="mt-6">
            <BaseButton
              id="app-header-deposit-button"
              variant="secondary"
              @click="isPlaying = false"
            >
              {{ $t("button.close") }}
            </BaseButton>
          </div>
        </template>
      </div>
    </template>
  </template>
</template>
