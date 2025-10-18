<script setup lang="ts">
import type { PropType } from "vue";
import type { Response as DemoSessionResponse } from "~/modules/games/infra/ui/CreateGameSessionDemoFromGamePage";
import type { Response as SessionResponse } from "~/modules/games/infra/ui/CreateGameSessionFromGamePage";

const userModule = useUserModule();
const siteStore = useSiteStore();
const gameSessionStore = useGameSessionStore();
const nuxtApp = useNuxtApp();

const props = defineProps({
  launchMode: {
    type: String as PropType<"session" | "demo" | undefined>,
    default: undefined,
  },
  gameSession: {
    type: Object as PropType<SessionResponse | null>,
    default: null,
  },
  gameDemoSession: {
    type: Object as PropType<DemoSessionResponse | null>,
    default: null,
  },
});

const emit = defineEmits<{
  (e: "abort"): void;
}>();

const session = computed(() => {
  if (props.launchMode === "session") {
    return props.gameSession;
  }
  else if (props.launchMode === "demo") {
    return props.gameDemoSession;
  }
  return null;
});

watch(() => props.launchMode, (mode) => {
  // The player is only really playing if it's a real session
  if (mode === "session") {
    gameSessionStore.playing = true;
  }
  else {
    gameSessionStore.playing = false;
  }

  if (mode) {
    nuxtApp.callHook("frontend:events:games:game-session-started");
  }
  else {
    nuxtApp.callHook("frontend:events:games:game-session-finished");
  }
}, { immediate: true });

onUnmounted(() => {
  gameSessionStore.playing = false;
  nuxtApp.callHook("frontend:events:games:game-session-finished");
});
</script>

<template>
  <div>
    <template v-if="session">
      <iframe
        v-if="!session.isFailure"
        :src="session.value.url"
        loading="eager"
        width="100%"
        height="100%"
        frameborder="0"
        marginwidth="0"
        marginheight="0"
        class="block border-0"
      />

      <div
        v-else
        class="w-full h-full px-6 flex flex-col items-center justify-center"
      >
        <NuxtImg
          class="h-7"
          :src="siteStore.getRelativeAssetPath('logos/logo.svg')"
          alt="Logo"
        />
        <template v-if="session.errorName === 'ErrorInsufficientFunds' || session.errorName === 'ErrorWalletNotFound'">
          <h2 class="mt-6 text-2xl font-semibold">{{ $t("game.game_launcher.error_insufficient_funds_title") }}</h2>
          <p class="text-center">{{ $t("game.game_launcher.error_insufficient_funds_message") }}</p>
          <div class="mt-6 flex items-center gap-4">
            <BaseButton
              id="app-header-deposit-button"
              variant="secondary"
              @click="emit('abort')"
            >
              {{ $t("button.close") }}
            </BaseButton>
            <BaseButton
              id="app-header-deposit-button"
              variant="emphasis"
              @click="userModule.ui.emitCommandOpenUserActionModal.handle('deposit')"
            >
              {{ $t("button.deposit") }}
            </BaseButton>
          </div>
        </template>
        <template v-else-if="session.errorName === 'ErrorGameNotAccessible'">
          <h2 class="mt-6 text-2xl font-semibold">{{ $t("game.game_launcher.error_game_not_accessible_title") }}</h2>
          <p class="text-center">
            {{ $t("game.game_launcher.error_game_not_accessible_message") }}
          </p>
          <div class="mt-6">
            <BaseButton
              id="app-header-deposit-button"
              variant="secondary"
              @click="emit('abort')"
            >
              {{ $t("button.close") }}
            </BaseButton>
          </div>
        </template>
        <template v-else-if="session.errorName === 'ErrorGameHasNoDemo'">
          <h2 class="mt-6 text-2xl font-semibold">{{ $t("game.game_launcher.error_game_has_no_demo_title") }}</h2>
          <p class="text-center">{{ $t("game.game_launcher.error_game_has_no_demo_message") }}</p>
          <div class="mt-6 flex items-center gap-4">
            <BaseButton
              id="app-header-deposit-button"
              variant="secondary"
              @click="emit('abort')"
            >
              {{ $t("button.close") }}
            </BaseButton>
          </div>
        </template>
        <template v-else-if="session.errorName === 'ErrorUnauthorized'">
          <h2 class="mt-6 text-2xl font-semibold">{{ $t("game.game_launcher.error_unauthorized_title") }}</h2>
          <p class="text-center">{{ $t("game.game_launcher.error_unauthorized_message") }}</p>
          <div class="mt-6 flex items-center gap-4">
            <BaseButton
              id="app-header-deposit-button"
              variant="secondary"
              @click="emit('abort')"
            >
              {{ $t("button.close") }}
            </BaseButton>
            <BaseButton
              id="app-header-deposit-button"
              variant="emphasis"
              @click="userModule.ui.emitCommandOpenUserActionModal.handle('login')"
            >
              {{ $t("button.login") }}
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
              @click="emit('abort')"
            >
              {{ $t("button.close") }}
            </BaseButton>
          </div>
        </template>
      </div>
    </template>
    <slot
      v-if="!session"
    />
  </div>
</template>
