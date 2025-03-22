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
      'px-3 py-1.5 w-full inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-all rounded data-[state=active]:bg-button-subtle data-[state=active]:text-foreground data-[state=active]:shadow hover:bg-button-secondary-hover disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring focus-visible:ring-offset',
      props.class,
    )"
  >
    <slot />
  </TabsTrigger>
</template>
