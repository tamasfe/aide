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
      class="w-full px-2.5 flex rounded-lg bg-button-secondary"
    >
      <div
        v-bind="delegatedProps"
        :class="cn(
          'py-1.5 w-full flex items-center justify-between space-x-2 overflow-x-scroll md:overflow-x-hidden custom-scrollbar',
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
  .custom-scrollbar::-webkit-scrollbar {
    width: 1px;
    height: 1px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    border-radius: 10rem;
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 10rem;
    border: 1px solid var(--giro-button-text-secondary);
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: transparent;
  }
</style>
