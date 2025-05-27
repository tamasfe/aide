<script setup lang="ts">
import { createColumnHelper, type ColumnDef } from "@tanstack/vue-table";
import { BaseCurrency, GameImage, GamePageLink } from "#components";
import type { Win } from "~/types/wins";

const { t } = useI18n();

defineProps<{
  data: Win[];
  loading: boolean;
}>();

const column = createColumnHelper<Win>();

const columns: ColumnDef<Win>[] = [
  column.accessor("userNickname", {
    header: t("winning_now.table.header_user_nickname"),
  }),
  column.accessor("game.name", {
    header: t("winning_now.table.header_game"),
    cell: ({ row }) => h(GamePageLink, { identifier: row.original.game.identifier, class: "flex items-center space-x-2 hover:underline" }, () => [
      h(GameImage, { identifier: row.original.game.identifier, class: "w-8 h-8 rounded-lg" }),
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
  <DataTable
    :data="data"
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
</template>
