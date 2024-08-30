<script setup lang="ts">
const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    :class="cn(
      'flex flex-row gap-2 items-center',
      props.class,
    )"
  >
    <BaseButton
      variant="ghost"
      size="ghost"
      class="flex flex-row gap-1 items-center hover:text-subtle-light"
    >
      <Icon
        name="lucide:thumbs-down"
        size="24"
      />
    </BaseButton>
    <div class="flex flex-col gap-1 leading-none whitespace-nowrap items-center text-sm text-center justify-center">
      <div>75.2%</div>
      <div class="font-medium">2.425</div>
    </div>
    <BaseButton
      variant="ghost"
      size="ghost"
      class="flex flex-row gap-1 items-center hover:text-subtle-light"
    >
      <Icon
        name="lucide:thumbs-up"
        size="24"
      />
    </BaseButton>
  </div>
</template>
