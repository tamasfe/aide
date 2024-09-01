<script setup lang="ts">
import { createColumnHelper, type ColumnDef } from "@tanstack/vue-table";
import { DataTableCopyCell } from "#components";

// TODO THIS IS NOT A REAL TYPE!!!!!!! JUST A PLACEHOLDER TO
// DEMONSTRATE DATA TABLE. DO NOT USE THIS, USE A REAL TYPE
type Withdrawal = {
  id: number;
  date: string;
  status: "COMPLETE" | "PENDING" | "FAILED";
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
  column.accessor("status", {
    header: "Status",
  }),
  column.accessor("amount", {
    header: "Amount",
    meta: {
      align: "right",
    },
  }),
] as ColumnDef<Withdrawal>[];

const data = shallowRef<Withdrawal[]>([]);

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
          title="No Withdrawals"
          icon="lucide:circle-arrow-up"
        />
      </template>
    </DataTable>
  </NuxtLayout>
</template>
