<template>
  <div class="flex flex-col sm:flex-row justify-between gap-x-28 gap-y-3">
    <div class="sm:w-[15%] text-subtle font-medium">
      <slot name="title" />
    </div>
    <div class="sm:flex-1 space-y-1">
      <div class="text-emphasis font-medium text-lg">
        <slot />
      </div>
      <div class="text-subtle">
        <slot name="description" />
      </div>
    </div>
    <slot name="actions" />
  </div>
</template>
