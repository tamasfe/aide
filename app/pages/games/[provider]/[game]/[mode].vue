<script setup lang="ts">
import type { Game } from "~/modules/games/domain/Game";
import type { Response as SessionResponse } from "~/modules/games/infra/ui/CreateGameSessionFromGamePage";
import type { Response as DemoSessionResponse } from "~/modules/games/infra/ui/CreateGameSessionDemoFromGamePage";

const mode = computed<"session" | "demo" | undefined>(() => {
  if (route.params.mode === "demo") {
    return "demo";
  }

  return "session";
});

definePageMeta({
  layout: "play",
  middleware: [(to) => {
    const localePath = useLocalePath();

    if (to.params.mode !== "play" && to.params.mode !== "demo") {
      return localePath({ name: "games-provider-game", params: to.params });
    }
  }],
});

const route = useRoute();

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

const userStore = useUserStore();
const nuxtApp = useNuxtApp();
const { t } = useI18n();
const router = useRouter();
const { params } = useRoute();
const localePath = useLocalePath();

useHead({
  title: t("page.game", { game: props.game?.name }),
});
</script>

<template>
  <section class="relative flex-1 overflow-hidden">
    <div class="text-subtle absolute inset-0 flex items-center justify-center -z-10">
      <BaseSpinner :size="36" />
    </div>
    <GameLauncher
      ref="gameFrameLauncher"
      class="absolute inset-0"
      :launch-mode="mode"
      :game-session="gameSession"
      :game-demo-session="gameDemoSession"
      @abort="router.replace(localePath({
        name: 'games-provider-game',
        params: params,
      }))"
    >
      <div class="w-full h-full flex flex-col items-center justify-center gap-y-6">
        <div v-if="!userStore.isAuthenticated" class="mt-6 flex items-center gap-4">
          <BaseButton
            size="xl"
            @click="nuxtApp.callHook('frontend:command:modal:login:open')"
          >
            {{ $t("button.login") }}
          </BaseButton>
        </div>
      </div>
    </GameLauncher>
  </section>
</template>
