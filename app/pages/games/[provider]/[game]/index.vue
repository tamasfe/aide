<script setup lang="ts">
import { useClipboard, useFullscreen } from "@vueuse/core";
import type { Game } from "~/modules/games/domain/Game";
import type { Response as SessionResponse } from "~/modules/games/infra/ui/CreateGameSessionFromGamePage";
import type { Response as DemoSessionResponse } from "~/modules/games/infra/ui/CreateGameSessionDemoFromGamePage";

definePageMeta({
  layout: "default",
});

const props = defineProps({
  game: {
    type: Object as PropType<Game | null>,
    default: null,
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

const games = useGameModule();
const nuxtApp = useNuxtApp();
const { t } = useI18n();
const userStore = useUserStore();
const launchMode = ref<"session" | "demo" | undefined>(undefined);
const el = useTemplateRef("gameFrame");
const siteStore = useSiteStore();
const { params } = useRoute();
const notificationsStore = useNotificationsStore();
const { enter } = useFullscreen(el);
const walletStore = useWalletStore();

useHead({
  title: t("page.game", { game: props.game?.name }),
});

const authenticated = computed(() => {
  return userStore.isAuthenticated;
});

const clipboard = useClipboard();

const { data: gameCategories } = useAsyncData(async () => {
  return games.ui.searchGameCategoriesByGroup.handle("game_page", true);
}, {
  server: true,
  lazy: true,
});

const copySessionUrlToClipboard = () => {
  if (props.gameSession && !props.gameSession.isFailure) {
    const id = useId();
    clipboard.copy(props.gameSession.value.url);
    notificationsStore.showToast({
      id,
      title: "Launch URL copied",
      message: "The game launch URL has been copied to your clipboard.",
      variant: "info",
      createdAt: new Date(),
    });
  }
};

const copyDemoSessionUrlToClipboard = () => {
  if (props.gameDemoSession && !props.gameDemoSession.isFailure) {
    const id = useId();
    clipboard.copy(props.gameDemoSession.value.url);
    notificationsStore.showToast({
      id,
      title: "Demo launch URL copied",
      message: "The game demo launch URL has been copied to your clipboard.",
      variant: "info",
      createdAt: new Date(),
    });
  }
};
</script>

<template>
  <div>
    <div class="bg-subtle rounded-lg border border-muted/5 overflow-hidden mb-8 relative">
      <div v-if="game" ref="gameFrame" class="relative py-40 md:py-0 md:h-[70vh]">
        <div class="text-subtle absolute inset-0 flex items-center justify-center">
          <BaseSpinner :size="36" />
        </div>

        <div
          v-show="!launchMode"
          class="pointer-events-none absolute -left-20 -top-20 -right-20 bottom-0 bg-subtle"
        >
          <div class="absolute inset-0 opacity-40 blur-[100px]">
            <NuxtImg
              provider="custom_cloudflare"
              format="webp"
              densities="1x"
              width="60"
              quality="1"
              class="object-cover w-full h-full "
              :src="`/games/${game.identifier}.jpg`"
              alt=" "
            />
          </div>
        </div>

        <GameLauncher
          class="absolute inset-0 "
          :launch-mode="launchMode"
          :game-session="gameSession"
          :game-demo-session="gameDemoSession"
          @abort="launchMode = undefined"
        >
          <div
            class="w-full h-full relative flex flex-col items-center justify-center gap-y-6"
          >
            <NuxtImg
              class="h-8 relative"
              :src="siteStore.getRelativeAssetPath('logos/logo.svg')"
              alt="Logo"
            />
            <h1 class="text-3xl font-semibold text-center">
              {{ game.name }}
            </h1>

            <template v-if="userStore.isAuthenticated">
              <!-- This button is show on desktop and will
                 trigger a game session on the same page -->
              <BaseButton
                v-if="walletStore.wallet"
                variant="primary"
                size="xl"
                class="hidden md:flex w-full gap-3 max-w-72"
                :disabled="!gameSession"
                @click.shift="copySessionUrlToClipboard()"
                @click.exact="launchMode = 'session'"
              >
                <BaseIcon
                  name="lucide:play"
                  :size="20"
                />
                {{ $t("button.play_now") }}
              </BaseButton>

              <!-- This button is shown on mobile and will
                 redirect to the game play page -->
              <NuxtLinkLocale
                v-if="walletStore.wallet"
                class="md:hidden"
                :to="{ name: 'games-provider-game-mode', params: { ... params, mode: 'play' } }"
              >
                <BaseButton
                  variant="primary"
                  size="xl"
                  class="w-full gap-3 max-w-72"
                  :disabled="!gameSession"
                >
                  <BaseIcon
                    name="lucide:play"
                    :size="20"
                  />
                  {{ $t("button.play_now") }}
                </BaseButton>
              </NuxtLinkLocale>

              <!-- This button will launch a demo session on desktop
                 on the same page if available -->
              <BaseButton
                v-if="game.demo"
                variant="secondary"
                size="xl"
                class="max-w-64 gap-3 hidden md:flex"
                :disabled="!gameDemoSession"
                @click.shift="copyDemoSessionUrlToClipboard()"
                @click.exact="launchMode = 'demo'"
              >
                <BaseIcon
                  name="lucide:rocket"
                  :size="20"
                />
                {{ $t("button.play_now_demo") }}
              </BaseButton>

              <!-- This button is show on mobile and will
                 redirect to the game demo page -->
              <NuxtLinkLocale
                v-if="game.demo"
                class="md:hidden"
                :to="{ name: 'games-provider-game-mode', params: { ... params, mode: 'demo' } }"
              >
                <BaseButton
                  variant="secondary"
                  class=" w-full gap-3 max-w-72"
                  :disabled="!gameDemoSession"
                >
                  <BaseIcon
                    name="lucide:rocket"
                    :size="20"
                  />
                  {{ $t("button.play_now_demo") }}
                </BaseButton>
              </NuxtLinkLocale>
            </template>

            <template v-else>
              <BaseButton
                v-if="game.demo"
                variant="primary"
                size="xl"
                class="max-w-64 gap-3 hidden md:flex"
                :disabled="!gameDemoSession"
                @click.shift="copyDemoSessionUrlToClipboard()"
                @click.exact="launchMode = 'demo'"
              >
                <BaseIcon
                  name="lucide:rocket"
                  :size="20"
                />
                {{ $t("button.play_now_demo") }}
              </BaseButton>

              <NuxtLinkLocale
                v-if="game.demo"
                class="md:hidden"
                :to="{ name: 'games-provider-game-mode', params: { ... params, mode: 'play' } }"
              >
                <BaseButton
                  variant="primary"
                  class=" w-full gap-3 max-w-72"
                  :disabled="!gameDemoSession"
                >
                  <BaseIcon
                    name="lucide:rocket"
                    :size="20"
                  />
                  {{ $t("button.play_now_demo") }}
                </BaseButton>
              </NuxtLinkLocale>

              <BaseButton
                v-if="!userStore.isAuthenticated"
                variant="secondary"
                @click="nuxtApp.callHook('frontend:command:modal:login:open')"
              >
                {{ $t("button.login") }}
              </BaseButton>
            </template>
          </div>
        </GameLauncher>
      </div>

      <BaseSkeleton v-else class="h-[60vh] md:h-[70vh]" :loading="false" />

      <GameDescription
        :game="game ?? undefined"
        class="relative"
        :authenticated="authenticated ?? false"
        @maximize="enter()"
      />
    </div>

    <template v-if="gameCategories">
      <GridHorizontalGames
        v-for="category in gameCategories?.filter(cat => cat.games && cat.games.length > 0)"
        :key="category.identifier"
        class="mb-6"
        :category-identifier="category.identifier"
        :initial-games="category.games || undefined"
      />
    </template>

    <GridHorizontalGamesLoading v-else class="mb-6" />
  </div>
</template>
