<script setup lang="ts">
import type { Win } from "~/types/wins";

const { $dependencies } = useNuxtApp();

const winsBufferSize = ref(10);
const loading = ref(true);
const increment = ref(0);

const WINNING_NOW_TABS = ["latest-wins", "highest-wins"] as const;
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
    loading.value = false;
  },
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
        >
          {{ toSentenceCase(tab) }}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="latest-wins">
        <WinningNowTable
          :key="increment"
          :data="latestWinsBuffer"
          :loading="loading"
        />
      </TabsContent>
      <TabsContent value="highest-wins">
        <WinningNowTable
          :key="increment"
          :data="highestWinsBuffer"
          :loading="loading"
        />
      </TabsContent>
    </Tabs>
  </div>
</template>
