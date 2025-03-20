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
        'w-full inline-flex items-center justify-between bg-button-secondary px-2 py-1.5 text-muted-foreground space-x-2 overflow-x-scroll md:overflow-x-hidden custom-scrollbar rounded-t-lg rounded-b-none md:rounded-lg',
        props.class,
      )"
    >
      <slot />
    </div>
    <slot name="suffix" />
  </TabsList>
</template>

<style scoped>
  .custom-scrollbar::-webkit-scrollbar {
    width: 1px;
    height: 1px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    border-radius: 0rem;
    background: var(--giro-button-secondary);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--giro-button-secondary);
    border-radius: 0rem;
    border: 1px solid var(--giro-button-text-secondary);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: var(--giro-button-secondary);
  }
</style>
