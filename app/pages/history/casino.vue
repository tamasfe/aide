<script setup lang="ts">
import { createColumnHelper, type ColumnDef } from "@tanstack/vue-table";
import { DataTableCopyCell, DataTableLinkCell } from "#components";

const { $dependencies } = useNuxtApp();
const walletStore = useWalletStore();
const { t } = useI18n();

useHead({
  title: t("page.dashboard_history"),
});

type GameActionTableRow = {
  id: number;
  date: string;
  game: {
    name: string;
    id: number;
  };
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
    cell: ({ getValue }) => h(
      DataTableLinkCell,
      { href: `/games/${getValue().id}` },
      () => getValue().name),
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
const loading = useState(`history-page-casino-loading`, () => true);
const pageIndex = useState(`history-page-casino-page-index`, () => 0);
const totalItems = useState(`history-page-casino-total-items`, () => $dependencies.games.ui.searchGameActionsPaginatingOnCasinoTable.PAGINATION_SIZE);
const pageSize = ref($dependencies.games.ui.searchGameActionsPaginatingOnCasinoTable.PAGINATION_SIZE);

const { data } = await useAsyncData(`dashboard-history-casino-table`, async () => {
  if (!walletStore.isInit) {
    return;
  }

  loading.value = true;
  const result = await $dependencies.games.ui.searchGameActionsPaginatingOnCasinoTable.handle(pageIndex.value);

  pageSize.value = result.pageSize;
  totalItems.value = result.totalItems;
  loading.value = false;

  return result;
},
{ watch: [pageIndex], lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);

const pagination = computed(() => {
  if (data === undefined) return undefined;
  return {
    pageIndex: pageIndex,
    pageSize: pageSize,
    rowCount: totalItems,
    updatePageIndex: (index: number) => { pageIndex.value = index; },
  };
});
</script>

<template>
  <NuxtLayout
    name="dashboard"
    section="history"
  >
    <DataTable
      :data="data?.gameActions ?? []"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
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
