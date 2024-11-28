<script setup lang="ts">
defineProps<{
  href: string;
}>();
</script>

<template>
  <BaseLink
    :to="href"
    class="flex flex-row items-center gap-1.5 cursor-pointer"
  >
    <BaseIcon
      name="lucide:link"
      :size="14"
      class="text-subtle"
    />
    <div>
      <slot />
    </div>
  </BaseLink>
</template>
