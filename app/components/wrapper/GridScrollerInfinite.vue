<script setup lang="ts" generic="T extends unknown[]">
import type { CSSProperties } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import type { GridScrollerBreakpointValues } from "../GridScroller.vue";

// ARCHITECTURE STATUS: ✴️
// * TODO: aspect ratio should be customizable for each screen size

type Props = {
  data: T;
  canLoadMore: boolean;
  columns: GridScrollerBreakpointValues;
  slidesToScroll: GridScrollerBreakpointValues;
  aspectRatio: CSSProperties["aspectRatio"];
  loading?: boolean;
  distance?: number;
  gap?: number;
};

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  distance: 1800,
  gap: 1,
});

const emit = defineEmits(["trigger:load"]);

// NOTE This component is using any for ref template of GridScroller because generic types are not properly supported current version of Vue, so we have to use any type. when https://github.com/vuejs/language-tools/issues/3206 is fixed we SHOULD change this to respective type
const gridScroller = ref<any>(null);

const onLoadMore = () => {
  if (props.loading) return;
  emit("trigger:load");
};

onMounted(() => {
  if (gridScroller.value) {
    const gridScrollerContainer = gridScroller.value.$el.querySelector(
      ".giro__grid-scroller-container",
    ) as HTMLElement;

    useInfiniteScroll(gridScrollerContainer, onLoadMore, {
      direction: "right",
      distance: props.distance,
      interval: 100,
      // determines if there's more data to load
      canLoadMore: () => {
        return props.canLoadMore;
      },
    });
  }
});
</script>

<template>
  <GridScroller
    ref="gridScroller"
    :columns="columns"
    :aspect-ratio="aspectRatio"
    :slides-to-scroll="slidesToScroll"
    :data="data as T"
    :gap="gap"
  >
    <template #title>
      <slot name="title" />
    </template>

    <template #default="{ item }">
      <slot :item="item" />
    </template>

    <template #options>
      <slot name="options" />
    </template>

    <template
      v-if="canLoadMore"
      #loading
    >
      <div
        class="flex items-center justify-center w-full h-full bg-subtle rounded-default"
      >
        <Icon
          class="text-subtle animate-spin"
          name="lucide:loader-circle"
          size="38"
        />
      </div>
    </template>
  </GridScroller>
</template>
