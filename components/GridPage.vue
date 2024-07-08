<!-- TODO: Add server side rendering support -->
<script setup lang="ts">
import { PhCaretLeft, PhCaretRight } from "@phosphor-icons/vue";

const props = withDefaults(
  defineProps<{
    data: unknown[];
    columns: number;
    showControls?: boolean;
    loading?: boolean;
    slidesToScroll?: number;
  }>(),
  {
    showControls: true,
    loading: false,
    slidesToScroll: 1,
  },
);

const { data, columns } = toRefs(props);

const slider = ref<HTMLElement | null>(null);

const emit = defineEmits(["click:nextPage", "click:previousPage"]);

const isAtBeginning = ref(true);
const isTheEnd = ref(false);

const onScroll = () => {
  if (slider.value) {
    isAtBeginning.value = slider.value.scrollLeft === 0;
    isTheEnd.value
      = slider.value.scrollLeft + slider.value.clientWidth
      >= slider.value.scrollWidth;
  }
};

const nextPage = () => {
  if (isTheEnd.value) return;
  if (slider.value) {
    const slideWidth = slider.value.children[0]?.clientWidth;
    const gap = parseInt(getComputedStyle(slider.value).gap, 10);
    slider.value.scrollLeft += (slideWidth + gap) * props.slidesToScroll;
  }
  emit("click:nextPage");
};

const previousPage = () => {
  if (isAtBeginning.value) return;
  if (slider.value) {
    const slideWidth = slider.value.children[0]?.clientWidth;
    const gap = parseInt(getComputedStyle(slider.value).gap, 10);
    slider.value.scrollLeft -= (slideWidth + gap) * props.slidesToScroll;
  }
  emit("click:previousPage");
};

const maxSlides = computed(() => {
  return Math.ceil(data.value.length / columns.value);
});

onMounted(() => {
  if (slider.value) {
    slider.value.addEventListener("scroll", onScroll);
  }
});

onBeforeUnmount(() => {
  if (slider.value) {
    slider.value.removeEventListener("scroll", onScroll);
  }
});
</script>

<template>
  <div class="flex flex-col gap-y-4 py-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-x-8">
        <div class="text-[24px] font-bold">
          <slot name="title" />
        </div>
        <div
          v-if="maxSlides > 1 && showControls && !loading"
          class="flex items-center gap-x-4 text-3xl font-bold cursor-pointer"
        >
          <button
            type="button"
            class="p-1 bg-subtle text-subtle outline-none rounded-[0.4rem]"
            :class="[
              isAtBeginning
                ? 'opacity-50 cursor-default'
                : 'hover:bg-emphasis hover:text-emphasis',
            ]"
            @click="previousPage"
          >
            <PhCaretLeft :size="24" />
          </button>
          <button
            type="button"
            class="p-1 bg-subtle text-subtle outline-none rounded-[0.4rem]"
            :class="[
              isTheEnd
                ? 'opacity-50 cursor-default'
                : 'hover:bg-emphasis hover:text-emphasis',
            ]"
            @click="nextPage"
          >
            <PhCaretRight :size="24" />
          </button>
        </div>
      </div>
      <slot name="options" />
    </div>
    <div
      ref="slider"
      class="w-full flex items-center gap-4 overflow-auto sm:overflow-hidden giro__hide-scroll giro__category_container"
    >
      <div
        v-for="(datapoint, index) in data"
        :key="index"
        class="select-none"
        :style="{
          flexBasis: `calc((100% - ${columns}rem) / ${columns})`,
          flexShrink: 0,
          width: '100%',
        }"
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
.giro__category_container {
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}
</style>
