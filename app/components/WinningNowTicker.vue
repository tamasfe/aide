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

// Add new win to FIFO array after preloading its image
const addNewWin = async (win: Keyified<Win>) => {
  try {
    displayedWins.value.unshift(win);
    displayedWins.value.length = Math.min(displayedWins.value.length, WINS_BUFFER_SIZE);
  }
  catch (error) {
    // If image preloading fails, still add the win but log the error
    console.warn("Failed to preload image, adding win anyway:", error);
    displayedWins.value.unshift(win);
    displayedWins.value.length = Math.min(displayedWins.value.length, WINS_BUFFER_SIZE);
  }
};

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;

useAsyncData("winning-now-slider-ticker-events", async () => {
  const wins = await $dependencies.tickers.ui.searchTickerEventsFromWinningNow.handle();
  const keyifiedWins = wins.map(win => useAddKeyFromIdentifier(camelizeKeys(win)));

  // Populate initial wins (no preloading needed for initial load)
  displayedWins.value = keyifiedWins.slice(0, WINS_BUFFER_SIZE);

  return keyifiedWins;
},
{ lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);

useCreateSubscriptionToWebsocketTickerChannel(
  $dependencies.websockets.ui.wsChannelManagers.ticker,
  "winning_now",
  (message) => {
    const win = useAddKeyFromIdentifier(camelizeKeys(message));
    // Use the async addNewWin function to preload image
    addNewWin(win);
  },
);
</script>

<template>
  <div class="md:flex md:items-center md:justify-center md:pr-4">
    <h3 class="text-center flex md:flex-col items-center md:justify-center gap-2 mb-3 lg:mb-0">
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
        class="flex gap-2 md:gap-4 mask-edge-fade-right"
      >
        <div
          v-for="{ key, data } in displayedWins"
          :key="key"
          class="flex-shrink-0"
        >
          <GamePageLink v-if="data" :identifier="data.data.game.identifier">
            <div class="group flex items-center space-x-3 bg-subtle p-2 rounded-lg outline-none border border-muted/5 pr-4">
              <div class="shrink-0 relative rounded border border-muted/5 aspect-[3/4] h-14 overflow-hidden">
                <NuxtImg
                  provider="custom_cloudflare"
                  sizes="40px"
                  format="webp"
                  quality="10"
                  fetchpriority="low"
                  class="absolute inset-0 object-cover w-full h-full transition-transform transform hover:scale-105 cursor-pointer"
                  :class="cn('w-full h-full aspect-[3/4] text-primary text-center')"
                  :src="`/games/${data.data.game.identifier}.jpg`"
                  :alt="data.data.game.name"
                />
              </div>
              <div class="leading-tight min-w-0 flex-1">
                <div class="">{{ data.data.userNickname }}</div>
                <div class="text-subtle text-xs min-w-0 mb-1">{{ data.data.game.name }}</div>
                <div class="text-md sm:text-lg font-semibold bg-button-primary text-transparent bg-clip-text">
                  <BaseCurrency
                    :currency="data.data.currency"
                    :value="data.data.amount"
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

.slide-in-enter-from {
  transform: scale(0.5);
  opacity: 0;
}

.slide-in-move {
  transition: all 0.3s ease-in-out;
}
</style>
