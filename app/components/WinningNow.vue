<script setup lang="ts">
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

type Win = {
  key: string;
  amount: number;
  currency: string;
  userNickname: string;
  game: {
    id: number;
    imageUrl: string;
    name: string;
  };
};
const buffer = ref<Win[]>([]);
const loading = ref(true);

let increment = 0;

useCreateSubscriptionToWebsocket(
  $dependencies.websockets.ui.wsChannelManagers.newestWins,
  (message) => {
    buffer.value.unshift(({
      key: increment.toString(),
      amount: message.data.data.amount,
      currency: message.data.data.currency,
      userNickname: message.data.data.user_nickname,
      game: {
        id: message.data.data.game.id,
        imageUrl: message.data.data.game.image_url,
        name: message.data.data.game.name,
      },
    }));

    increment += 1;

    if (buffer.value.length > WINS_BUFFER_SIZE) {
      buffer.value.pop();
    }

    slider.value?.emblaApi?.scrollTo(0);

    loading.value = false;
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
      :loading="loading"
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
        <BaseLink :to="{ name: 'games-id', params: { id: item.game.id } }">
          <div class="group flex items-center space-x-3 bg-subtle p-2 rounded-lg outline-none border border-muted/10">
            <div class="relative aspect-[3/4] w-14 flex-shrink-0 rounded overflow-hidden border border-muted/10">
              <NuxtImg
                :src="item.game.imageUrl"
                alt=""
                class="block object-cover h-full w-full transition-transform transform hover:scale-105 cursor-pointer"
              />
            </div>
            <div class="font-medium leading-tight space-y-1 min-w-0 flex-1">
              <div class="truncate">{{ item.userNickname }}</div>
              <div class="text-subtle text-sm truncate min-w-0">{{ item.game.name }}</div>
              <div class="sm:text-lg font-semibold bg-button-primary text-transparent bg-clip-text">
                <BaseCurrency
                  :currency="item.currency"
                  :value="item.amount"
                  variant="ghost"
                  class="truncate"
                />
              </div>
            </div>
          </div>
        </BaseLink>
      </template>
    </BaseSlider>
  </div>
</template>
