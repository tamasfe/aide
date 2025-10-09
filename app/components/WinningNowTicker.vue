<script setup lang="ts">
import type { Keyified } from "~/types/utils";
import type { Win } from "~/types/wins";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * not done
// TRANSLATION STATUS:  ✴️
//   * not done

const { $dependencies } = useNuxtApp();

const WINS_BUFFER_SIZE = 6;

const displayedWins = useState<Keyified<Win>[]>("winning-now-ticker-displayed-wins", () => []);

// Add new win to FIFO array
const addNewWin = (win: Keyified<Win>) => {
  displayedWins.value = [win, ...displayedWins.value].slice(0, WINS_BUFFER_SIZE);
};

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;
await useAsyncData("winning-now-slider-ticker-events", async () => {
  const wins = await $dependencies.tickers.ui.searchTickerEventsFromWinningNow.handle();
  const keyifiedWins = wins.map(win => useAddKeyFromIdentifier(camelizeKeys(win)));

  // Populate initial wins
  displayedWins.value = keyifiedWins.slice(0, WINS_BUFFER_SIZE);
  return keyifiedWins;
},
{ lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);

useCreateSubscriptionToWebsocketTickerChannel(
  $dependencies.websockets.ui.wsChannelManagers.ticker,
  {
    id: `winning-now-ticker-${Date.now()}`,
    message: "winning_now",
    callback: (message) => {
      const win = useAddKeyFromIdentifier(camelizeKeys(message));
      addNewWin(win);
    },
  },
);
</script>

<template>
  <div class="flex items-center justify-center">
    <h3 class="min-w-[6rem] sm:min-w-[8rem] text-center flex flex-col items-center justify-center">
      <div class="mb-2 leading-none text-5xl">🏆</div>
      <div class="whitespace-pre-wrap text-sm sm:text-base leading-tight bg-button-primary text-transparent bg-clip-text font-semibold">
        {{ $t('winning_now.title') }}
      </div>
    </h3>

    <div class="w-full overflow-hidden">
      <div class="flex gap-4 transition-transform duration-500 ease-out">
        <TransitionGroup
          :appear="false"
          name="slide-in"
          tag="div"
          class="flex gap-4 min-w-0"
        >
          <div
            v-for="item in displayedWins"
            :key="item.key"
            class="flex-shrink-0 w-80"
          >
            <GamePageLink v-if="item.data" :identifier="item.data.data.game.identifier">
              <div class="relative group flex items-center space-x-3 bg-subtle p-2 rounded-lg outline-none border border-muted/5 h-24">
                <div class="self-stretch relative aspect-[3/4] h-full rounded overflow-hidden border border-muted/5">
                  <GameTickerImage
                    priority="low"
                    :identifier="item.data.data.game.identifier"
                    class="block object-cover h-full w-full transition-transform transform hover:scale-105 cursor-pointer"
                  />
                </div>
                <div class="font-medium leading-tight space-y-1 min-w-0 flex-1">
                  <div class="truncate">{{ item.data.data.userNickname }}</div>
                  <div class="text-subtle text-sm truncate min-w-0">{{ item.data.data.game.name }}</div>
                  <div class="sm:text-lg font-semibold bg-button-primary text-transparent bg-clip-text">
                    <BaseCurrency
                      :currency="item.data.data.currency"
                      :value="item.data.data.amount"
                      variant="ghost"
                      class="truncate"
                    />
                  </div>
                </div>
              </div>
            </GamePageLink>
          </div>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-in-enter-active {
  transition: all 0.4s ease-in-out;
}

.slide-in-leave-active {
  transition: all 0.4s ease-in-out;
}

.slide-in-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-in-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-in-move {
  transition: transform 0.4s ease-in-out;
}

/* Fixed width for consistent sizing */
.flex-shrink-0 {
  width: 16rem; /* 320px fixed width */
}
</style>
