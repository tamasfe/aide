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

// NOTE: this component is using any for ref template of grid because generic types are not properly supported current version of Vue, so we have to use any type. when https://github.com/vuejs/language-tools/issues/3206 is fixed we SHOULD change this to respective type
// eslint-disable-next-line
const slider = ref<any>(null);

const slides = {
  sm: 0.7,
  md: 2.5,
  lg: 2.5,
  xl: 3.5,
};
const slidesToScroll = {
  sm: 1,
  md: 1,
  lg: 1,
  xl: 1,
};

const buffer = ref<Keyified<Win>[]>([]);

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = false;
await useAsyncData("winning-now-slider-ticker-events", async () => {
  const wins = await $dependencies.tickers.ui.searchTickerEventsFromWinningNow.handle();
  buffer.value.unshift(...wins.map(tickerEvent => useAddKeyFromIdentifier(tickerEvent)));
},
{ lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);

useCreateSubscriptionToWebsocket(
  $dependencies.websockets.ui.wsChannelManagers.newestWins,
  (message) => {
    const win = useAddKeyFromIdentifier(camelizeKeys(message));
    if (buffer.value.some(item => item.key === win.key)) {
      return; // Prevent duplicates
    }
    buffer.value.unshift(win);

    if (buffer.value.length > WINS_BUFFER_SIZE) {
      buffer.value.pop();
    }

    slider.value?.emblaApi?.scrollTo(0);
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
    <BaseSlider
      ref="slider"
      class="w-full"
      :data="buffer"
      :slides="slides"
      :slides-to-scroll="slidesToScroll"
      :gap="1"
      :options="{
        align: 'start',
        loop: false,
      }"
    >
      <template #default="{ item }">
        <GamePageLink v-if="item.data" :identifier="item.data.data.game.identifier">
          <div class="relative group flex items-center space-x-3 bg-subtle p-2 rounded-lg outline-none border border-muted/5 h-24">
            <div class="self-strech relative aspect-[3/4] h-full rounded overflow-hidden border border-muted/5">
              <GameImage
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
      </template>
    </BaseSlider>
  </div>
</template>
