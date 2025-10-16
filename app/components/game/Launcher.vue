<script setup lang="ts">
import type { PropType } from "vue";
import type { Response as DemoSessionResponse } from "~/modules/games/infra/ui/CreateGameSessionDemoFromGamePage";
import type { Response as SessionResponse } from "~/modules/games/infra/ui/CreateGameSessionFromGamePage";

const { $dependencies } = useNuxtApp();
const siteStore = useSiteStore();

const props = defineProps({
  launchMode: {
    type: String as PropType<"session" | "demo" | undefined>,
    default: undefined,
  },
  gameIdentifier: {
    type: String,
    required: true,
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
</script>

<template>
  <div>
    <template v-if="session">
      <GameIframe
        v-if="!session.isFailure"
        :game-identifier="gameIdentifier"
        :src="session.value.url"
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
              @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('deposit')"
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
              @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('login')"
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
