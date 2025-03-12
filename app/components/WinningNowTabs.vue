<script setup lang="ts">
import type { Win } from "~/types/wins";

const { $dependencies } = useNuxtApp();
const userStore = useUserStore();

const winsBufferSize = ref(10);
const loadingWins = ref(true);
const loadingMyBets = ref(true);
const increment = ref(0);

const WINNING_NOW_TABS = ["my-bets", "latest-wins", "highest-wins"] as const;
const currentTab = ref<typeof WINNING_NOW_TABS[number]>("latest-wins");
const latestWinsBuffer = ref<Array<Win>>([]);
const highestWinsBuffer = ref<Array<Win>>([]);

useCreateSubscriptionToWebsocket(
  $dependencies.websockets.ui.wsChannelManagers.newestWins,
  (message) => {
    latestWinsBuffer.value.unshift(({
      key: increment.value.toString(),
      amount: message.data.data.amount,
      currency: message.data.data.currency,
      userNickname: message.data.data.user_nickname,
      game: {
        id: message.data.data.game.id,
        imageUrl: message.data.data.game.image_url,
        name: message.data.data.game.name,
      },
    }));
    if (latestWinsBuffer.value.length > winsBufferSize.value) {
      latestWinsBuffer.value.pop();
    }

    // add win to the highestWinsBuffer array if the amount is higher than the last win in the array
    highestWinsBuffer.value.unshift(({
      key: increment.value.toString(),
      amount: message.data.data.amount,
      currency: message.data.data.currency,
      userNickname: message.data.data.user_nickname,
      game: {
        id: message.data.data.game.id,
        imageUrl: message.data.data.game.image_url,
        name: message.data.data.game.name,
      },
    }));
    // sort the array by amount in descending order
    highestWinsBuffer.value.sort((a, b) => b.amount - a.amount);
    if (highestWinsBuffer.value.length > winsBufferSize.value) {
      highestWinsBuffer.value.pop();
    }

    increment.value += 1;
    loadingWins.value = false;
  },
);

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
const { data: myBetsData } = await useAsyncData(`winning-now-my-bets-table`, async () => {
  if (!userStore.isAuthenticated) {
    return;
  }

  loadingMyBets.value = true;
  const result = await $dependencies.games.ui.searchGameActionsPaginatingOnCasinoTable.handle(0);
  loadingMyBets.value = false;

  return result;
},
{ watch: [() => userStore.isAuthenticated], lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold sm:text-2xl flex items-center space-x-2">
      {{ $t('winning_now.title') }}
    </h2>

    <Tabs v-model="currentTab" class="mt-6">
      <TabsList class="mb-4">
        <TabsTrigger
          v-for="tab in WINNING_NOW_TABS"
          :key="tab"
          :is-active="tab === currentTab"
          :value="tab"
          :disabled="tab === 'my-bets' && !userStore.isAuthenticated"
        >
          {{ toSentenceCase(tab) }}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="my-bets">
        <DataTableGameActionsMyBets
          v-if="userStore.isAuthenticated && myBetsData"
          :data="myBetsData.gameActions"
          :loading="loadingWins"
          :username="userStore.user.username"
          :pagination="undefined"
        />
      </TabsContent>
      <TabsContent value="latest-wins">
        <DataTableWins
          :key="increment"
          :data="latestWinsBuffer"
          :loading="loadingWins"
        />
      </TabsContent>
      <TabsContent value="highest-wins">
        <DataTableWins
          :key="increment"
          :data="highestWinsBuffer"
          :loading="loadingWins"
        />
      </TabsContent>
    </Tabs>
  </div>
</template>
