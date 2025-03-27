<script setup lang="ts">
import { createColumnHelper, type ColumnDef } from "@tanstack/vue-table";
import { BaseCurrency, DataTableLinkCell } from "#components";

const { t } = useI18n();

type GameActionTableRow = {
  id: number;
  date: string;
  game: {
    name: string;
    id: number;
  };
  action: string;
  amount: number;
  amountBonus: number;
  currency: string;
};

const props = defineProps<{
  data: GameActionTableRow[];
  username: string;
  loading: boolean;
  pagination?: {
    pageSize: Ref<number>;
    pageIndex: Ref<number>;
    rowCount: Ref<number>;
    updatePageIndex: (index: number) => void;
  };
}>();

const column = createColumnHelper<GameActionTableRow>();

const columns: ColumnDef<GameActionTableRow>[] = [
  column.display({
    header: t("game_actions.table.header_username"),
    cell: () => h("span", props.username),
  }),
  column.accessor("game", {
    header: t("game_actions.table.header_game"),
    cell: ({ getValue }) => h(
      DataTableLinkCell,
      { href: `/games/${getValue().id}` },
      () => getValue().name),
  }),
  column.accessor("date", {
    header: t("game_actions.table.header_date"),
  }),
  column.accessor("action", {
    header: t("game_actions.table.header_action"),
  }),
  column.accessor("amount", {
    header: t("game_actions.table.header_amount"),
    meta: { align: "right" },
    cell: ({ getValue, row }) => h(BaseCurrency, { class: "flex justify-end", value: Number(getValue()), currency: row.original.currency, variant: "primary" }),
  }),
  column.accessor("amountBonus", {
    header: t("game_actions.table.header_amount_bonus"),
    meta: { align: "right" },
    cell: ({ getValue, row }) => h(BaseCurrency, { class: "flex justify-end", value: Number(getValue()), currency: row.original.currency, variant: "primary" }),
  }),
] as ColumnDef<GameActionTableRow>[];
</script>

<template>
  <DataTable
    :data="data"
    :columns="columns"
    :loading="loading"
    :pagination="pagination"
  >
    <template #empty>
      <BaseEmpty
        :title="t('game_actions.table.empty')"
        icon="lucide:trophy"
      />
    </template>
  </DataTable>
</template>
