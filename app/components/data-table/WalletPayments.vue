<script setup lang="ts">
import { createColumnHelper, type ColumnDef } from "@tanstack/vue-table";
import { DataTableCopyCell } from "#components";

type WalletPayment = {
  id: number;
  date: string;
  type: string;
  status: string;
  amount: string;
};

defineProps<{
  loading: boolean;
  payments: WalletPayment[];
}>();

const column = createColumnHelper<WalletPayment>();

const columns: ColumnDef<WalletPayment>[] = [
  column.accessor("id", {
    header: "ID",
    cell: ({ getValue }) => h(DataTableCopyCell, { value: getValue() }),
  }),
  column.accessor("date", {
    header: "Date",
  }),
  column.accessor("type", {
    header: "Type",
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
] as ColumnDef<WalletPayment>[];
</script>

<template>
  <DataTable
    :data="payments"
    :columns="columns"
    :loading="loading"
  >
    <template #empty>
      <slot name="empty">
        <BaseEmpty
          :title="$t('wallet.payments.empty')"
          icon="lucide:wallet-cards"
        />
      </slot>
    </template>
  </DataTable>
</template>
