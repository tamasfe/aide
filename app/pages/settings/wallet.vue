<script setup lang="ts">
import { createColumnHelper, type ColumnDef } from "@tanstack/vue-table";

// TODO THIS IS NOT A REAL TYPE!!!!!!! JUST A PLACEHOLDER TO
// DEMONSTRATE DATA TABLE. DO NOT USE THIS, USE A REAL TYPE
type WalletTransaction = {
  id: number;
  date: string;
  type: "DEPOSIT" | "WITHDRAWAL";
  status: "COMPLETE" | "PENDING";
  amount: string;
};

const column = createColumnHelper<WalletTransaction>();

const columns: ColumnDef<WalletTransaction>[] = [
  column.accessor("id", {
    header: "Transaction ID",
  }),
  column.accessor("date", {
    header: "Created",
    cell: ({ getValue }) => getValue(), // IMPORTANT TODO we should use dayjs probably
  }),
  column.accessor("type", {
    header: "Type",
  }),
  column.accessor("status", {
    header: "Status",
  }),
  column.accessor("amount", {
    header: "Amount",
  }),
] as ColumnDef<WalletTransaction>[];

const data = shallowRef<WalletTransaction[]>([
  { id: 1, date: "2024-01-03", type: "DEPOSIT", status: "COMPLETE", amount: "2598.25" },
  { id: 2, date: "2024-02-03", type: "WITHDRAWAL", status: "COMPLETE", amount: "0.15" },
]);

const loading = ref(false);
</script>

<template>
  <NuxtLayout
    name="dashboard"
    section="settings"
  >
    <DataTable
      :data="data"
      :columns="columns"
      :loading="loading"
    >
      <template #empty>
        <BaseEmpty
          title="No Transactions"
          icon="lucide:wallet-cards"
        />
      </template>
    </DataTable>
  </NuxtLayout>
</template>
