<script setup lang="ts">
import { createColumnHelper, type ColumnDef } from "@tanstack/vue-table";
import { DataTableCopyCell } from "#components";

// TODO THIS IS NOT A REAL TYPE!!!!!!! JUST A PLACEHOLDER TO
// DEMONSTRATE DATA TABLE. DO NOT USE THIS, USE A REAL TYPE
type Withdrawal = {
  id: number;
  date: string;
  game: string;
  action: "BET" | "WIN";
  amount: string;
};

const column = createColumnHelper<Withdrawal>();

const columns: ColumnDef<Withdrawal>[] = [
  column.accessor("id", {
    header: "ID",
    cell: ({ getValue }) => h(DataTableCopyCell, { value: getValue() }),
  }),
  column.accessor("date", {
    header: "Date",
    cell: ({ getValue }) => formatDate(getValue()),
  }),
  column.accessor("game", {
    header: "Game",
  }),
  column.accessor("action", {
    header: "Game",
  }),
  column.accessor("amount", {
    header: "Amount",
    meta: {
      align: "right",
    },
  }),
] as ColumnDef<Withdrawal>[];

const data = shallowRef<Withdrawal[]>([
  // test data
  { id: 1, date: "2021-01-01", game: "Blackjack", action: "BET", amount: "100" },
  { id: 2, date: "2021-01-02", game: "Blackjack", action: "WIN", amount: "200" },
  { id: 3, date: "2021-01-03", game: "Blackjack", action: "BET", amount: "300" },
  { id: 4, date: "2021-01-04", game: "Blackjack", action: "WIN", amount: "400" },
  { id: 5, date: "2021-01-05", game: "Blackjack", action: "BET", amount: "500" },
  { id: 6, date: "2021-01-06", game: "Blackjack", action: "WIN", amount: "600" },
  { id: 7, date: "2021-01-07", game: "Blackjack", action: "BET", amount: "700" },
  { id: 8, date: "2021-01-08", game: "Blackjack", action: "WIN", amount: "800" },
  { id: 9, date: "2021-01-09", game: "Blackjack", action: "BET", amount: "900" },
  { id: 10, date: "2021-01-10", game: "Blackjack", action: "WIN", amount: "1000" },
  { id: 11, date: "2021-01-11", game: "Blackjack", action: "BET", amount: "1100" },
  { id: 12, date: "2021-01-12", game: "Blackjack", action: "WIN", amount: "1200" },
  { id: 13, date: "2021-01-13", game: "Blackjack", action: "BET", amount: "1300" },
  { id: 14, date: "2021-01-14", game: "Blackjack", action: "WIN", amount: "1400" },
]);

const loading = ref(false);
</script>

<template>
  <NuxtLayout
    name="dashboard"
    section="history"
  >
    <DataTable
      :data="data"
      :columns="columns"
      :loading="loading"
    >
      <template #empty>
        <BaseEmpty
          title="No Game Rounds"
          icon="lucide:trophy"
        />
      </template>
    </DataTable>
  </NuxtLayout>
</template>
