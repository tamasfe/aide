<script setup lang="ts">
import type { Keyified } from "~/types/utils";
import type { Win } from "~/types/wins";

const { $dependencies } = useNuxtApp();
const userStore = useUserStore();

const winsBufferSize = ref(10);
const loadingMyBets = ref(false);
const increment = ref(0);

const WINNING_NOW_TABS = ["my_bets", "latest_bets", "high_rollers"] as const;
const currentTab = ref<typeof WINNING_NOW_TABS[number]>("latest_bets");
const uniqueWins = useState<Map<string, Keyified<Win>>>("winning-now-tabs-latestWinsBuffer", () => new Map());

const latestWinsBuffer = computed(() => {
  return Array.from(uniqueWins.value.values()).slice(0, winsBufferSize.value);
});
const highestWinsBuffer = computed(() => {
  return Array.from(uniqueWins.value.values())
    .sort((a, b) => b.data.data.amount - a.data.data.amount)
    .slice(0, winsBufferSize.value);
});

const WINS_ENABLE_SERVER_SIDE_RENDERING = true;
const WINS_DEFER_CLIENT_SIDE_LOADING = true;
await useAsyncData("winning-now-tabs-ticker-events", async () => {
  const wins = await $dependencies.tickers.ui.searchTickerEventsFromWinningNow.handle();
  for (const win of wins) {
    const keyifiedWin = useAddKeyFromIdentifier(camelizeKeys(win));
    uniqueWins.value.set(keyifiedWin.key, keyifiedWin);
  }
  return wins;
},
{ lazy: WINS_DEFER_CLIENT_SIDE_LOADING, server: WINS_ENABLE_SERVER_SIDE_RENDERING },
);

useCreateSubscriptionToWebsocketTickerChannel(
  $dependencies.websockets.ui.wsChannelManagers.ticker,
  {
    id: `winning-now-tabs-${Date.now()}`,
    message: "winning_now",
    callback: (message) => {
      const keyifiedWin = useAddKeyFromIdentifier(camelizeKeys(message));
      uniqueWins.value.set(keyifiedWin.key, keyifiedWin);

      increment.value += 1;
    },
  },
);

const MY_BETS_ENABLE_SERVER_SIDE_RENDERING = false;
const MY_BETS_DEFER_CLIENT_SIDE_LOADING = true;
const { data: myBetsData } = await useAsyncData(`winning-now-my-bets-table`, async () => {
  if (!userStore.isAuthenticated) {
    return;
  }

  loadingMyBets.value = true;
  const result = await $dependencies.games.ui.searchGameActionsPaginatingOnCasinoTable.handle(0);
  loadingMyBets.value = false;

  return result;
},
{ watch: [() => userStore.isAuthenticated], lazy: MY_BETS_DEFER_CLIENT_SIDE_LOADING, server: MY_BETS_ENABLE_SERVER_SIDE_RENDERING },
);
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold sm:text-2xl flex items-center space-x-2">
      {{ $t('winning_now.title') }}
    </h2>

    <Tabs v-model="currentTab" class="mt-4 space-y-4">
      <TabsList class="rounded bg-subtle lg:inline-block w-full">
        <TabsTrigger
          v-for="tab in WINNING_NOW_TABS"
          :key="tab"
          :is-active="tab === currentTab"
          :value="tab"
          :disabled="tab === 'my_bets' && !userStore.isAuthenticated"
        >
          {{ toSentenceCase($t(`home_page.winning_now_tabs.${tab}`)) }}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="my_bets">
        <DataTableGameActionsMyBets
          v-if="userStore.isAuthenticated && myBetsData"
          :data="myBetsData.gameActions"
          :loading="loadingMyBets"
          :username="userStore.user.username"
          :pagination="undefined"
        />
      </TabsContent>
      <TabsContent value="latest_bets">
        <DataTableWins
          :key="increment"
          :data="latestWinsBuffer"
          :loading="false"
        />
      </TabsContent>
      <TabsContent value="high_rollers">
        <DataTableWins
          :key="increment"
          :data="highestWinsBuffer"
          :loading="false"
        />
      </TabsContent>
    </Tabs>
  </div>
</template>
