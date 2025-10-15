<script setup lang="ts">
import type { Game } from "~/modules/games/domain/Game";
import type { Response as SessionResponse } from "~/modules/games/infra/ui/CreateGameSessionFromGamePage";
import type { Response as DemoSessionResponse } from "~/modules/games/infra/ui/CreateGameSessionDemoFromGamePage";

definePageMeta({
  layout: "play",
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

const userStore = useUserStore();
const { $dependencies } = useNuxtApp();
const { t } = useI18n();
const gameIdentifier = useGameIdentifier();
const router = useRouter();
const { params } = useRoute();
const localePath = useLocalePath();

useHead({
  title: t("page.game", { game: props.game?.name }),
});
</script>

<template>
  <GameLauncher
    ref="gameFrameLauncher"
    class="flex-1"
    launch-mode="demo"
    :game-identifier="gameIdentifier"
    :game-session="gameSession"
    :game-demo-session="gameDemoSession"
    @abort="router.replace(localePath({
      name: 'games-provider-game',
      params: params,
    }))"
  >
    <div class="w-full h-full bg-subtle flex flex-col items-center justify-center gap-y-6">
      <div v-if="!userStore.isAuthenticated" class="mt-6 flex items-center gap-4">
        <BaseButton
          size="xl"
          @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('login')"
        >
          {{ $t("button.login") }}
        </BaseButton>
      </div>
    </div>
  </GameLauncher>
</template>
