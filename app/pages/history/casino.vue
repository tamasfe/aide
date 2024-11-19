<script setup lang="ts">
import { createColumnHelper, type ColumnDef } from "@tanstack/vue-table";
import { DataTableCopyCell } from "#components";

const { $dependencies } = useNuxtApp();
const { t } = useI18n();
type GameActionTableRow = {
  id: number;
  date: string;
  game: string;
  action: string;
  amount: string;
};

const column = createColumnHelper<GameActionTableRow>();

const columns: ColumnDef<GameActionTableRow>[] = [
  column.accessor("id", {
    header: t("dashboard.history.casino.table_header_id"),
    cell: ({ getValue }) => h(DataTableCopyCell, { value: getValue() }),
  }),
  column.accessor("date", {
    header: t("dashboard.history.casino.table_header_date"),
  }),
  column.accessor("game", {
    header: t("dashboard.history.casino.table_header_game"),
  }),
  column.accessor("action", {
    header: t("dashboard.history.casino.table_header_action"),
  }),
  column.accessor("amount", {
    header: t("dashboard.history.casino.table_header_amount"),
    meta: {
      align: "right",
    },
  }),
] as ColumnDef<GameActionTableRow>[];

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
const loading = ref(true);

const { data } = await useAsyncData<GameActionTableRow[]>(`dashboard-history-casino-table`, async () => {
  loading.value = true;
  const result = await $dependencies.games.ui.searchGameActionsPaginatingOnCasinoTable.handle();
  loading.value = false;
  return result;
},
{ lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);
</script>

<template>
  <NuxtLayout
    name="dashboard"
    section="history"
  >
    <DataTable
      :data="data ?? []"
      :columns="columns"
      :loading="loading"
    >
      <template #empty>
        <BaseEmpty
          :title="t('dashboard.history.casino.table_empty')"
          icon="lucide:trophy"
        />
      </template>
    </DataTable>
  </NuxtLayout>
</template>
