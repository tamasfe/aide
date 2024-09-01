<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef } from "@tanstack/vue-table";
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from "@tanstack/vue-table";

// DESIGN STATUS:      ✴️
//   - still needs mobile responsive version of table

// TODO - look at how i do it in the admin component
// which combines both server + client pagination. for now i have stripped
// some away just to get the core component in, but ive already done all
// the work, so you can just re-copy all the exact code over from the admin data table.
// not the entire component, as ive already styled this one etc, just move the
// appropriate javascript parts over to support the additional pagination

interface DataTableProps<TData, TValue> {
  data?: TData[];
  columns: ColumnDef<TData, TValue>[];
  loading: boolean;
}

const props = withDefaults(
  defineProps<DataTableProps<TData, TValue>>(),
  {
    data: () => [],
    loading: false,
  },
);

const buildTable = () => {
  return {
    get data() { return props.data; },
    get columns() { return props.columns; },
    getCoreRowModel: getCoreRowModel(),
  };
};

const table = useVueTable(buildTable());
</script>

<template>
  <div class="relative whitespace-nowrap">
    <table>
      <thead>
        <tr
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
          class="tr"
        >
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            class="th"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-if="table.getRowModel().rows?.length">
          <tr
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            class="tr"
          >
            <td
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
              class="td"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </td>
          </tr>
        </template>
        <template v-else-if="!loading">
          <tr>
            <td :colspan="columns.length">
              <slot
                v-if="$slots.empty"
                name="empty"
              />
              <BaseEmpty v-else />
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <LoadingOverlay
      :loading="loading"
    />
  </div>
</template>

<style scoped>
table {
  @apply w-full;
}
th, td {
  @apply p-1 text-left;
}
</style>
