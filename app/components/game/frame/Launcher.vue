<script setup lang="ts">
import type { HtmlAttributes } from "@unhead/vue";
import type { PropType } from "vue";

const { $dependencies } = useNuxtApp();
const siteStore = useSiteStore();
const walletStore = useWalletStore();
const userStore = useUserStore();

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

// We have to disable server-side rendering for the game, as we rely on our cloudflare proxy to route these requests
// to our main-instance in ireland. If we enable SSR, the request will be made to the API instance within the same region, which means
// in the case of a secondary region, the request will be sent against the API in that region, which then has to send mutating
// queries to the main DB in the primary region leading to major slowdowns due to high SQL query RTT (round trip time).
// If we want to allow SSR session inititalization, we have to first find a solution for redirecting these requests to the main region internally.
const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
const { data: gameSessionResult, execute } = useAsyncData(() =>
  $dependencies.games.ui.createGameSessionFromGamePage.handle(props.gameIdentifier, userStore.user?.id, walletStore.wallet?.currency, props.clientType),
{
  watch: [() => userStore.isAuthenticated, () => walletStore.balanceStatus],
  lazy: DEFER_CLIENT_SIDE_LOADING,
  server: ENABLE_SERVER_SIDE_RENDERING,
},
);

/**
 * Forces a refresh when user "closes" the game screen as sometimes the pinia store glitches out when user logs in or out (making both user & wallet store change).
 */
watch(() => isPlaying.value, async (newIsPlaying) => {
  if (newIsPlaying === false) {
    await execute();
  }
});

/**
 * Game providers are not in sync with User's wallet in real time,
 * so we force a refresh of the game when a payment succeeds.
 * Note: we do not use the wallet balance as it goes down with every bet, which the provider does keep track of.
 */
const paymentListenerId = ref<number | null>(null);
onMounted(() => {
  paymentListenerId.value = $dependencies.common.asyncMessagePublisher.subscribe(
    "backend:events:payments:payment-status-updated",
    async (event) => {
      if (event.data.status === "succeeded") {
        await execute();
      }
    },
  );
});
onUnmounted(() => {
  if (paymentListenerId.value) {
    $dependencies.common.asyncMessagePublisher.unsubscribe(paymentListenerId.value);
    paymentListenerId.value = null;
  }
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
        <template v-if="gameSessionResult.errorName === 'ErrorInsufficientFunds' || gameSessionResult.errorName === 'ErrorWalletNotFound'">
          <h2 class="mt-6 text-2xl font-semibold">{{ $t("game.game_launcher.error_insufficient_funds_title") }}</h2>
          <p class="text-center">{{ $t("game.game_launcher.error_insufficient_funds_message") }}</p>
          <div class="mt-6 flex items-center gap-4">
            <BaseButton
              id="app-header-deposit-button"
              variant="secondary"
              @click="isPlaying = false"
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
        <template v-else-if="gameSessionResult.errorName === 'ErrorGameNotAccessible'">
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
        <template v-else-if="gameSessionResult.errorName === 'ErrorUnauthorized'">
          <h2 class="mt-6 text-2xl font-semibold">{{ $t("game.game_launcher.error_unauthorized_title") }}</h2>
          <p class="text-center">{{ $t("game.game_launcher.error_unauthorized_message") }}</p>
          <div class="mt-6 flex items-center gap-4">
            <BaseButton
              id="app-header-deposit-button"
              variant="secondary"
              @click="isPlaying = false"
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
