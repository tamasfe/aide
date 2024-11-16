<script setup lang="ts" generic="TData, TValue">
import type { ColumnDef } from "@tanstack/vue-table";
import { FlexRender, getCoreRowModel, useVueTable } from "@tanstack/vue-table";

// DESIGN STATUS:      ✴️
//   - still needs mobile responsive version of table

// TODO - look at how i do it in the admin component
// which combines both server + client pagination. for now i have stripped
// some away just to get the core component in, but ive already done all
// the work, so you can just re-copy all the exact code over from the admin data table.
// not the entire component, as ive already styled this one etc, just move the
// appropriate javascript parts over to support the additional pagination

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  loading?: boolean;
}

const props = withDefaults(defineProps<DataTableProps<TData, TValue>>(), {
  loading: false,
});

const buildTable = () => {
  return {
    get data() {
      return props.data;
    },
    get columns() {
      return props.columns;
    },
    getCoreRowModel: getCoreRowModel(),
  };
};

const table = useVueTable(buildTable());
</script>

<template>
  <div class="relative whitespace-nowrap">
    <table v-if="table.getRowModel().rows?.length">
      <thead class="hidden sm:table-header-group">
        <tr
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
          class="tr"
        >
          <th
            v-for="header in headerGroup.headers"
            :key="header.id"
            :class="cn(
              'th',
              header.column.columnDef.meta?.align === 'center' && 'text-center',
              header.column.columnDef.meta?.align === 'right' && 'text-right',
            )"
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
        <tr
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          class="tr flex flex-col sm:table-row"
        >
          <td
            v-for="cell in row.getVisibleCells()"
            :key="cell.id"
            :class="cn(
              'td',
              cell.column.columnDef.meta?.align === 'center' && 'text-center',
              cell.column.columnDef.meta?.align === 'right' && 'text-right',
              'w-full sm:w-auto flex justify-between items-center sm:table-cell',
            )"
          >
            <div class="block sm:hidden">
              <FlexRender
                :render="cell.column.columnDef.header"
                :props="cell.getContext()"
              />
            </div>
            <div>
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-else-if="!loading"
      class="bg-subtle rounded-default"
    >
      <slot
        v-if="$slots.empty"
        name="empty"
      />
      <BaseEmpty v-else />
    </div>

    <DataTableLoadingOverlay :loading="loading" />
  </div>
</template>

<style scoped>
table {
  @apply text-left w-full;
}
th,
td {
  @apply px-2 py-1.5 sm:p-2 rounded-sm;
}
th {
  @apply text-xs font-semibold uppercase;
}
td {
  @apply text-sm text-subtle-light font-medium;
}
tr:nth-child(odd) td {
  @apply bg-subtle;
}
</style>
