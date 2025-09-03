<script setup lang="ts">
import { type HTMLAttributes, computed } from "vue";
import { TabsList, type TabsListProps } from "reka-ui";

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
      stickyOnMobile === true ? 'sticky md:static z-[5] top-[60px]' : 'static',
    )"
  >
    <div
      class="w-full h-full px-1.5 flex rounded bg-button-secondary"
    >
      <div
        v-bind="delegatedProps"
        :class="cn(
          'py-1.5 w-full h-full flex items-center justify-between justify space-x-2 overflow-x-auto md:overflow-x-hidden',
          props.class,
        )"
      >
        <slot />
      </div>
    </div>
    <slot name="suffix" />
  </TabsList>
</template>

<style scoped>
  /* This CSS class allows for a visible horizontall scrollbar in-tune with our stylings. */
  .custom-scrollbar::-webkit-scrollbar {
    width: 0.5px;
    height: 0.5px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    border-radius: 10rem;
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 10rem;
    border: 1px solid var(--color-button-text-secondary);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: transparent;
  }
</style>
