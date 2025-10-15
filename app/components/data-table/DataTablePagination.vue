<script setup lang="ts" generic="TData">
import type { Table } from "@tanstack/vue-table";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

defineProps<DataTablePaginationProps<TData>>();

defineEmits([
  "firstPage",
  "lastPage",
  "previousPage",
  "nextPage",
  "pageSize",
]);
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <!-- Commenting instead of deleting it in case we ever want to allow the user the following options:  -->
    <!-- <div class="text-sm text-muted-foreground">
      <div v-if="table.getFilteredSelectedRowModel().rows.length > 0">
        {{ table.getFilteredSelectedRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} row(s) selected.
      </div>
    </div> -->
    <!-- Commenting instead of deleting it in case we ever want to allow the user the following options:  -->
    <!-- <div class="flex items-center space-x-2">
        <p class="text-sm font-medium">Per page</p>
        <Select
          :model-value="`${table.getState().pagination.pageSize}`"
          @update:model-value="$emit('pageSize', $event)"
        >
          <SelectTrigger class="h-8 w-[70px]">
            <SelectValue :placeholder="`${table.getState().pagination.pageSize}`" />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem
              v-for="pageSize in pageSizes"
              :key="pageSize"
              :value="`${pageSize}`"
            >
              {{ pageSize }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div> -->
    <div class="flex items-center justify-center text-sm font-medium text-subtle">
      Page {{ table.getState().pagination.pageIndex + 1 }} of {{ table.getPageCount() }}
    </div>
    <div class="flex items-center space-x-2">
      <BaseButton
        variant="subtle"
        class="hidden h-8 w-8 p-0 lg:flex"
        :disabled="!table.getCanPreviousPage()"
        @click="$emit('firstPage')"
      >
        <span class="sr-only">Go to first page</span>
        <BaseIcon :size="20" name="lucide:chevrons-left" />
      </BaseButton>
      <BaseButton
        variant="subtle"
        class="h-8 w-8 p-0"
        :disabled="!table.getCanPreviousPage()"
        @click="$emit('previousPage')"
      >
        <span class="sr-only">Go to previous page</span>
        <BaseIcon :size="20" name="lucide:chevron-left" />
      </BaseButton>
      <BaseButton
        variant="subtle"
        class="h-8 w-8 p-0"
        :disabled="!table.getCanNextPage()"
        @click="$emit('nextPage')"
      >
        <span class="sr-only">Go to next page</span>
        <BaseIcon :size="20" name="lucide:chevron-right" />
      </BaseButton>
      <BaseButton
        variant="subtle"
        class="hidden h-8 w-8 p-0 lg:flex"
        :disabled="!table.getCanNextPage()"
        @click="$emit('lastPage')"
      >
        <span class="sr-only">Go to last page</span>
        <BaseIcon :size="20" name="lucide:chevrons-right" />
      </BaseButton>
    </div>
  </div>
</template>
