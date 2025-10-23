<script setup lang="ts">
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "reka-ui";
import type { Keyified } from "~/types/utils";
import type { Win } from "~/types/wins";

const tickers = useTickerModule();
const websockets = useWebsocketModule();
const games = useGameModule();
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

useAsyncData("winning-now-tabs-ticker-events", async () => {
  const wins = await tickers.ui.searchTickerEventsFromWinningNow.handle();
  for (const win of wins) {
    const keyifiedWin = useAddKeyFromIdentifier(camelizeKeys(win));
    uniqueWins.value.set(keyifiedWin.key, keyifiedWin);
  }
  return wins;
},
{ lazy: WINS_DEFER_CLIENT_SIDE_LOADING, server: WINS_ENABLE_SERVER_SIDE_RENDERING },
);

useCreateSubscriptionToWebsocketTickerChannel(
  websockets.ui.wsChannelManagers.ticker,
  "winning_now",
  (message) => {
    const keyifiedWin = useAddKeyFromIdentifier(camelizeKeys(message));
    uniqueWins.value.set(keyifiedWin.key, keyifiedWin);

    increment.value += 1;
  },
);

const MY_BETS_ENABLE_SERVER_SIDE_RENDERING = false;
const MY_BETS_DEFER_CLIENT_SIDE_LOADING = true;
const { data: myBetsData } = useAsyncData(`winning-now-my-bets-table`, async () => {
  if (!userStore.isAuthenticated) {
    return;
  }

  loadingMyBets.value = true;
  const result = await games.ui.searchGameActionsPaginatingOnCasinoTable.handle(0);
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

    <TabsRoot v-model="currentTab" class="mt-4 p-4 rounded-lg bg-subtle">
      <TabsList class="flex gap-2 mb-4">
        <TabsTrigger
          v-for="tab in WINNING_NOW_TABS"
          :key="tab"
          class="
              px-4
              py-2
              h-full
              flex-1
              md:flex-grow-0
              inline-flex
              items-center
              justify-center
              whitespace-nowrap
              text-md
              font-medium
              ring-offset-background
              transition-all
              rounded
              data-[state=active]:bg-button-secondary
              data-[state=active]:text-foreground
              data-[state=active]:shadow
              md:hover:bg-button-secondary-hover
              disabled:pointer-events-none
              disabled:opacity-50
              focus-visible:outline-none
              focus-visible:ring
              focus-visible:ring-offset
            "
          :is-active="tab === currentTab"
          :value="tab"
          :disabled="tab === 'my_bets' && !userStore.isAuthenticated"
        >
          <div class="capitalize">
            {{ $t(`home_page.winning_now_tabs.${tab}`) }}
          </div>
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
    </TabsRoot>
  </div>
</template>
