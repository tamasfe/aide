<script setup lang="ts">
import { createColumnHelper, type ColumnDef } from "@tanstack/vue-table";
import { DataTableCopyCell } from "#components";

const walletStore = useWalletStore();

// TODO: do we want this behaviour? Or should we (for example) keep the user in the page and show them a "log in to see your balance & transactions" message?
if (!walletStore.isInit) {
  await navigateTo("/");
}

// TODO THIS IS NOT A REAL TYPE!!!!!!! JUST A PLACEHOLDER TO
// DEMONSTRATE DATA TABLE. DO NOT USE THIS, USE A REAL TYPE
type WalletTransaction = {
  id: number;
  date: string;
  type: "DEPOSIT" | "WITHDRAWAL";
  status: "COMPLETE" | "PENDING" | "FAILED";
  amount: string;
};

const column = createColumnHelper<WalletTransaction>();

const columns: ColumnDef<WalletTransaction>[] = [
  column.accessor("id", {
    header: "ID",
    cell: ({ getValue }) => h(DataTableCopyCell, { value: getValue() }),
  }),
  column.accessor("date", {
    header: "Date",
    cell: ({ getValue }) => formatDate(getValue()),
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
] as ColumnDef<WalletTransaction>[];

const data = shallowRef<WalletTransaction[]>([
  { id: 82295, date: "2024-01-03", type: "DEPOSIT", status: "COMPLETE", amount: "2598.25" },
  { id: 82313, date: "2024-02-03", type: "WITHDRAWAL", status: "COMPLETE", amount: "0.15" },
  { id: 84292, date: "2024-03-15", type: "DEPOSIT", status: "PENDING", amount: "1500.00" },
  { id: 89259, date: "2024-03-22", type: "WITHDRAWAL", status: "COMPLETE", amount: "120.50" },
  { id: 928429, date: "2024-04-01", type: "DEPOSIT", status: "COMPLETE", amount: "300.75" },
  { id: 929943, date: "2024-04-10", type: "WITHDRAWAL", status: "FAILED", amount: "500.00" },
  { id: 991111, date: "2024-05-05", type: "DEPOSIT", status: "COMPLETE", amount: "850.00" },
  { id: 918428, date: "2024-05-18", type: "WITHDRAWAL", status: "PENDING", amount: "1000.00" },
  { id: 924228, date: "2024-06-07", type: "DEPOSIT", status: "COMPLETE", amount: "1200.99" },
  { id: 959292, date: "2024-06-21", type: "WITHDRAWAL", status: "COMPLETE", amount: "25.00" },
]);

const loading = ref(false);
</script>

<template>
  <NuxtLayout
    name="dashboard"
    section="settings"
  >
    <div v-if="walletStore.isInit">
      <DashboardSettingsWalletBalance
        :balance="walletStore.wallet.balanceValue"
        :currency="walletStore.wallet.currency"
      />

      <div class="mt-8">
        <h2 class="mb-4 text-center text-lg font-medium">{{ $t('dashboard.settings.wallet.recent_transactions') }}</h2>
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
      </div>
    </div>
  </NuxtLayout>
</template>
