<script setup lang="ts">
import { createColumnHelper, type ColumnDef } from "@tanstack/vue-table";
import { DataTableCopyCell } from "#components";

const { t } = useI18n();

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
    header: t("dashboard.history.shared.table_payments_header_id"),
    cell: ({ getValue }) => h(DataTableCopyCell, { value: getValue() }),
  }),
  column.accessor("date", {
    header: t("dashboard.history.shared.table_payments_header_date"),
  }),
  column.accessor("type", {
    header: t("dashboard.history.shared.table_payments_header_type"),
  }),
  column.accessor("status", {
    header: t("dashboard.history.shared.table_payments_header_status"),
  }),
  column.accessor("amount", {
    header: t("dashboard.history.shared.table_payments_header_amount"),
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
