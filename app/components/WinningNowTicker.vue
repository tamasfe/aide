<script setup lang="ts">
import type { Keyified } from "~/types/utils";
import type { Win } from "~/types/wins";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * not done
// TRANSLATION STATUS:  ✴️
//   * not done

const { $dependencies } = useNuxtApp();

const WINS_BUFFER_SIZE = 12;

const displayedWins = useState<Keyified<Win | null>[]>("winning-now-ticker-displayed-wins", () => []);

// Add new win to FIFO array
const addNewWin = (win: Keyified<Win>) => {
  displayedWins.value.unshift(win);
  displayedWins.value.length = Math.min(displayedWins.value.length, WINS_BUFFER_SIZE);
};

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;

useAsyncData("winning-now-slider-ticker-events", async () => {
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
  <div class="md:flex md:items-center md:justify-center md:pr-4">
    <h3 class="text-center flex md:flex-col items-center md:justify-center gap-2 mb-3 lg:mb-0 px-4">
      <div class="leading-none md:text-2xl">🏆</div>
      <div class="text-lg md:text-sm leading-tight text-primary font-semibold">
        {{ $t('winning_now.title') }}
      </div>
    </h3>

    <div class="w-full overflow-hidden">
      <TransitionGroup
        :appear="false"
        name="slide-in"
        tag="div"
        class="flex gap-2 md:gap-4 pl-4 md:pl-0 mask-edge-fade-right"
      >
        <div
          v-for="item in displayedWins"
          :key="item.key"
          class="flex-shrink-0"
        >
          <GamePageLink v-if="item.data" :identifier="item.data.data.game.identifier">
            <div class="group flex items-center space-x-3 bg-subtle p-2 rounded-lg outline-none border border-muted/5 pr-4">
              <div class="shrink-0 relative rounded border border-muted/5 aspect-[3/4] h-14 overflow-hidden">
                <GameTickerImage
                  fetchpriority="low"
                  :identifier="item.data.data.game.identifier"
                  class="absolute inset-0 object-cover w-full h-full transition-transform transform hover:scale-105 cursor-pointer"
                />
              </div>
              <div class="leading-tight min-w-0 flex-1">
                <div class="">{{ item.data.data.userNickname }}</div>
                <div class="text-subtle text-xs min-w-0 mb-1">{{ item.data.data.game.name }}</div>
                <div class="text-md sm:text-lg font-semibold bg-button-primary text-transparent bg-clip-text">
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
</template>

<style scoped>
.slide-in-enter-active {
  transition: all 0.3s ease-in-out;
}

.slide-in-leave-active {
  transition: all 0.3s ease-in-out;
}

.slide-in-enter-from {
  transform: scale(0.5);
  opacity: 0;
}

.slide-in-leave-to {
  transform: scale(0.5);
  opacity: 0;
}

.slide-in-move {
  transition: all 0.3s ease-in-out;
}
</style>
