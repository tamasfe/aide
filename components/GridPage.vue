<!-- TODO: Add server side rendering support -->
<script setup lang="ts">
import { PhCaretLeft, PhCaretRight } from "@phosphor-icons/vue";
import { BaseCarousel } from "#components";

const { isMobile } = useDevice();

const props = withDefaults(
  defineProps<{
    data: unknown[];
    columns: number;
    showControls?: boolean;
    loading?: boolean;
  }>(),
  {
    showControls: true,
    loading: false,
  },
);

const { data, columns } = toRefs(props);

const carousel = ref<InstanceType<typeof BaseCarousel> | null>(null);

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
          v-if="maxSlides > 1 && showControls && !loading"
          class="flex items-center gap-x-4 text-3xl font-bold cursor-pointer"
        >
          <button
            type="button"
            class="p-1 bg-subtle text-subtle outline-none"
            :class="[carousel?.isFirst ? 'opacity-50 cursor-default' : '']"
            @click="previousPage"
          >
            <PhCaretLeft :size="24" />
          </button>
          <button
            type="button"
            class="p-1 bg-subtle text-subtle outline-none"
            :class="[carousel?.isLast ? 'opacity-50 cursor-default' : '']"
            @click="nextPage"
          >
            <PhCaretRight :size="24" />
          </button>
        </div>
      </div>
      <slot name="options" />
    </div>
    <BaseCarousel
      v-if="!isMobile"
      ref="carousel"
    >
      <div
        v-for="(_, slide) in maxSlides"
        :key="slide"
        class="flex items-center gap-4"
      >
        <div
          v-for="(_, col) in columns"
          :key="col"
          class="flex-1"
        >
          <slot
            v-if="data[slide * columns + col]"
            name="default"
            :data="data[slide * columns + col]"
          />
        </div>
      </div>
    </BaseCarousel>
    <div
      v-else
      class="flex items-center gap-4 overflow-auto giro__hide-scroll"
    >
      <div
        v-for="(datapoint, index) in data"
        :key="index"
        class="giro__grid-page-item"
      >
        <slot
          name="default"
          :data="datapoint"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.giro__grid-page-item {
  flex: 0 0 auto;
}
</style>
