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
const latestWinsBuffer = useState<Array<Keyified<Win>>>("winning-now-tabs-latestWinsBuffer", () => []);
const highestWinsBuffer = useState<Array<Keyified<Win>>>("winning-now-tabs-highestWinsBuffer", () => []);

const WINS_ENABLE_SERVER_SIDE_RENDERING = false;
const WINS_DEFER_CLIENT_SIDE_LOADING = true;
await useAsyncData("winning-now-tabs-ticker-events", async () => {
  const wins = await $dependencies.tickers.ui.searchTickerEventsFromWinningNow.handle();
  latestWinsBuffer.value.push(...wins.map(win => useAddKeyFromIdentifier(win)));
  highestWinsBuffer.value.push(...wins.map(win => useAddKeyFromIdentifier(win)));
  return wins;
},
{ lazy: WINS_DEFER_CLIENT_SIDE_LOADING, server: WINS_ENABLE_SERVER_SIDE_RENDERING },
);

useCreateSubscriptionToWebsocket(
  $dependencies.websockets.ui.wsChannelManagers.newestWins,
  (message) => {
    const win = useAddKeyFromIdentifier(camelizeKeys(message));

    if (!latestWinsBuffer.value.some(item => item.key === win.key)) {
      latestWinsBuffer.value.unshift(useAddKeyFromIdentifier(camelizeKeys(message)));
      if (latestWinsBuffer.value.length > winsBufferSize.value) {
        latestWinsBuffer.value.pop();
      }
    }

    if (!highestWinsBuffer.value.some(item => item.key === win.key)) {
      highestWinsBuffer.value.unshift(useAddKeyFromIdentifier(camelizeKeys(message)));
      // sort the array by amount in descending order
      highestWinsBuffer.value.sort((a, b) => b.data.data.amount - a.data.data.amount);
      if (highestWinsBuffer.value.length > winsBufferSize.value) {
        highestWinsBuffer.value.pop();
      }
    }

    increment.value += 1;
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
      <TabsList class="max-w-sm">
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
