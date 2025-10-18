<script setup lang="ts">
import { useFullscreen } from "@vueuse/core";
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
const user = useUserModule();
const { t } = useI18n();
const userStore = useUserStore();
const launchMode = ref<"session" | "demo" | undefined>(undefined);
const el = useTemplateRef("gameFrame");
const siteStore = useSiteStore();
const { params } = useRoute();
const { enter } = useFullscreen(el);

useHead({
  title: t("page.game", { game: props.game?.name }),
});

const authenticated = computed(() => {
  return userStore.isAuthenticated;
});

const { data: gameCategories } = useAsyncData(async () => {
  return games.ui.searchGameCategoriesByGroup.handle("game_page", true);
}, {
  server: true,
  lazy: true,
});

/* Redirect if the game is successfully searched, but server returns no results (404) */
// watch([() => props.game, () => statusLoadingGame.value], async ([game, statusLoadingGame]) => {
//   if (game === null && statusLoadingGame === "success") {
//     await navigateTo("/");
//   }
// });
</script>

<template>
  <div>
    <div class="bg-subtle rounded-lg border border-muted/5 overflow-hidden mb-8">
      <div v-if="game" ref="gameFrame" class="relative py-40 md:py-0 md:h-[70vh] border-b border-muted/5">
        <GameLauncher
          class="absolute inset-0"
          :launch-mode="launchMode"
          :game-session="gameSession"
          :game-demo-session="gameDemoSession"
          @abort="launchMode = undefined"
        >
          <div
            class="w-full h-full bg-subtle flex flex-col items-center justify-center gap-y-6"
          >
            <NuxtImg
              class="h-8"
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
                variant="primary"
                size="xl"
                class="hidden md:flex w-full gap-3 max-w-72"
                :disabled="!gameSession"
                @click="launchMode = 'session'"
              >
                <BaseIcon
                  name="lucide:play"
                  :size="20"
                />
                {{ $t("button.play_now") }}
              </BaseButton>

              <!-- This button is show on mobile and will
                 redirect to the game play page -->
              <NuxtLinkLocale
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
                class="mt-6 max-w-64 gap-3 hidden md:flex"
                :disabled="!gameDemoSession"
                @click="launchMode = 'demo'"
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
                class="mt-6 max-w-64 gap-3 hidden md:flex"
                :disabled="!gameDemoSession"
                @click="launchMode = 'demo'"
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
                @click="user.ui.emitCommandOpenUserActionModal.handle('login')"
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
        class="bg-subtle"
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
