<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <slot
        v-if="$slots.title"
        name="title"
      />

      <slot name="options" />
    </div>

    <slot />
  </div>
</template>
