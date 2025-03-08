<script setup lang="ts">
import { createColumnHelper, type ColumnDef } from "@tanstack/vue-table";
import { BaseCurrency, BaseLink, GameImage } from "#components";

const { $dependencies } = useNuxtApp();
const { t } = useI18n();

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

const winsBufferSize = ref(10);
const buffer = ref<Array<Win>>([]);
const loading = ref(true);
const increment = ref(0);

useCreateSubscriptionToWebsocket(
  $dependencies.websockets.ui.wsChannelManagers.newestWins,
  (message) => {
    buffer.value.unshift(({
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

    increment.value += 1;

    if (buffer.value.length > winsBufferSize.value) {
      buffer.value.pop();
    }

    loading.value = false;
  },
);

const column = createColumnHelper<Win>();

const columns: ColumnDef<Win>[] = [
  column.accessor("userNickname", {
    header: t("winning_now.table.header_user_nickname"),
  }),
  column.accessor("game.name", {
    header: t("winning_now.table.header_game"),
    cell: ({ row }) => h(BaseLink, { to: `/games/${row.original.game.id}`, class: "flex items-center space-x-2 hover:underline" }, () => [
      h(GameImage, { src: row.original.game.imageUrl, altText: row.original.game.name, class: "w-8 h-8 rounded-lg" }),
      h("span", row.original.game.name),
    ]),
  }),
  column.accessor("amount", {
    header: t("winning_now.table.header_amount"),
    meta: { align: "right" },
    cell: ({ getValue, row }) => h(BaseCurrency, { class: "flex justify-end", value: getValue(), currency: row.original.currency, variant: "primary" }),
  }),
] as ColumnDef<Win>[];
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold sm:text-2xl flex items-center space-x-2">
      {{ $t('winning_now.title') }}
    </h2>

    <DataTable
      :key="increment"
      class="mt-6"
      :data="buffer"
      :loading="loading"
      :columns="columns"
    >
      <template #empty>
        <slot name="empty">
          <BaseEmpty
            :title="$t('winning_now.table.empty')"
            icon="lucide:wallet-cards"
          />
        </slot>
      </template>
    </DataTable>
  </div>
</template>
