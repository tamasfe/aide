<!-- TODO: Add server side rendering support -->
<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import Carousel from "./Carousel.vue";

const breakpoints = useBreakpoints(breakpointsTailwind);
const md = breakpoints.greaterOrEqual("md");

const props = defineProps<{
  data: any[];
  columns: number;
}>();

const { data, columns } = toRefs(props);

const carousel = ref<InstanceType<typeof Carousel> | null>(null);

const emit = defineEmits(["click:nextPage", "click:previousPage"]);

const nextPage = () => {
  if (carousel.value) {
    carousel.value.next();
  }
  emit("click:nextPage");
};

const previousPage = () => {
  if (carousel.value) {
    carousel.value.prev();
  }
  emit("click:previousPage");
};

const maxSlides = computed(() => {
  return Math.ceil(data.value.length / columns.value);
});
</script>

<template>
  <div class="flex flex-col gap-y-4 py-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-x-2">
        <div class="text-[24px] font-bold">
          <slot name="title" />
        </div>
        <div
          class="hidden md:flex items-center gap-x-4 text-3xl font-bold cursor-pointer"
        >
          <div @click="previousPage">
            {{ `<` }}
          </div>
          <div @click="nextPage">
            {{ `>` }}
          </div>
        </div>
      </div>
      <slot name="options" />
    </div>
    <Carousel v-if="md" ref="carousel">
      <div
        v-for="(_, slide) in maxSlides"
        :key="slide"
        class="flex items-center gap-4"
      >
        <div v-for="(_, col) in columns" :key="col" class="flex-1">
          <slot
            v-if="data[slide * columns + col]"
            name="default"
            :data="data[slide * columns + col]"
          />
        </div>
      </div>
    </Carousel>
    <div
      v-else
      class="flex items-center gap-4 overflow-auto hide-scroll giro__hide-scroll"
    >
      <div
        v-for="(datapoint, index) in data"
        :key="index"
        class="giro__grid-page-item"
      >
        <slot name="default" :data="datapoint" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.giro__grid-page-item {
  flex: 0 0 auto;
}
</style>
