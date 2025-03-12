<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { TabsTrigger, type TabsTriggerProps, useForwardProps } from "radix-vue";

const props = defineProps<TabsTriggerProps & {
  isActive: boolean;
  class?: HTMLAttributes["class"];
}>();

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props;

  return delegated;
});

const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <TabsTrigger
    v-bind="forwardedProps"
    :is-active="isActive"
    :state="isActive ? 'active' : 'inactive'"
    :class="cn(
      'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-md font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg data-[state=active]:bg-button-subtle data-[state=active]:text-foreground data-[state=active]:shadow hover:bg-button-secondary-hover',
      props.class,
    )"
  >
    <slot />
  </TabsTrigger>
</template>
