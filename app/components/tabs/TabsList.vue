<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { TabsList, type TabsListProps } from "radix-vue";

const props = defineProps<TabsListProps & {
  class?: HTMLAttributes["class"];
  stickyOnMobile?: boolean;
}>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});
</script>

<template>
  <TabsList
    :class="cn(
      'w-full flex items-center space-x-6',
      stickyOnMobile === true ? 'sticky md:static z-[8] top-[60px]' : 'static',
    )"
  >
    <div
      v-bind="delegatedProps"
      :class="cn(
        'w-full inline-flex items-center justify-between rounded-lg bg-button-secondary px-2 py-1.5 text-muted-foreground space-x-2',
        props.class,
      )"
    >
      <slot />
    </div>
    <slot name="suffix" />
  </TabsList>
</template>
