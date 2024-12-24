<script setup lang="ts">
import type { EmblaCarouselType } from "embla-carousel";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * not done
// TRANSLATION STATUS:  ✴️
//   * not done

// NOTE: this component is using any for ref template of grid because generic types are not properly supported current version of Vue, so we have to use any type. when https://github.com/vuejs/language-tools/issues/3206 is fixed we SHOULD change this to respective type
// eslint-disable-next-line
const slider = ref<any>(null);

const slides = {
  sm: 0.7,
  md: 2.5,
  lg: 2.5,
  xl: 3.5,
};
const slidesToScroll = {
  sm: 1,
  md: 1,
  lg: 1,
  xl: 1,
};

const generateFakeData = (length: number) => {
  return Array.from({ length }, () => ({
    value: (Math.round(Math.random() * 100) % 8) + 1,
    name: `${Math.random().toString(36).substring(10)}***`,
    created: new Date(),
    key: String(Math.round(Math.random() * 1000)),
  }));
};

const BUFFER_SIZE = 20;
const buffer = useState("winning-now-data", () => generateFakeData(1));

const scrollNext = () => {
  if (slider.value) {
    const emblaApi = slider.value.emblaApi;
    emblaApi?.scrollNext();
  }
};

const getOldestDatapointIndex = (indexes: number[]) => {
  let oldestIndex = 0;
  for (const index of indexes) {
    if (!buffer.value[index]) continue;
    if (!buffer.value[oldestIndex]) continue;
    if (buffer.value[index].created.getTime() < buffer.value[oldestIndex]!.created.getTime()) {
      oldestIndex = index;
    }
  }
  return oldestIndex;
};

const updateData = (emblaApi: EmblaCarouselType) => {
  const [mockData] = generateFakeData(1);
  const indexes = emblaApi.slidesNotInView();
  if (indexes) {
    const oldestIndex = getOldestDatapointIndex(indexes);
    buffer.value[oldestIndex] = mockData!;
  }
};

const appendData = () => {
  const [mockData] = generateFakeData(1);
  buffer.value.push(mockData!);
};

const mockWSMessages = (emblaApi: EmblaCarouselType) => {
  setInterval(() => {
    if (buffer.value.length > BUFFER_SIZE) {
      updateData(emblaApi);
    }
    else {
      appendData();
    }
    scrollNext();
    // Inreased the interval so that it doesn't spam the console
  }, 1000000000);
};

onMounted(() => {
  const emblaApi: EmblaCarouselType | undefined = slider.value?.emblaApi;
  if (emblaApi) {
    mockWSMessages(emblaApi);
  }
});
</script>

<template>
  <div class="flex items-center justify-center">
    <h3 class="min-w-[6rem] sm:min-w-[8rem] text-center flex flex-col items-center justify-center">
      <div class="mb-2 leading-none text-5xl">🏆</div>
      <div
        class="whitespace-pre-wrap text-sm sm:text-base leading-tight bg-button-primary text-transparent bg-clip-text font-semibold"
      >
        {{ $t('winning_now.title') }}
      </div>
    </h3>
    <BaseSlider
      ref="slider"
      class="w-full"
      :data="buffer"
      :slides="slides"
      :slides-to-scroll="slidesToScroll"
      :gap="1"
      :options="{
        align: 'start',
        loop: true,
      }"
    >
      <template #default="{ item }">
        <BaseLink :to="{ name: 'todo' }">
          <div class="group flex items-center space-x-3 bg-subtle p-2 rounded-lg outline-none">
            <div class="flex-shrink-0 rounded-[0.7rem] w-[4.8rem]">
              <ImageRatio
                :src="`/assets/images/games/${item.value}.png`"
                alt=""
                ratio="300/350"
                class="group-hover:opacity-90 rounded-default"
              />
            </div>
            <div class="font-medium leading-tight space-y-1">
              <div>{{ item.name }}</div>
              <div class="text-subtle text-sm">Golden rush inferno</div>
              <div class="sm:text-lg font-semibold bg-button-primary text-transparent bg-clip-text">
                R$ 32.14
              </div>
            </div>
          </div>
        </BaseLink>
      </template>
    </BaseSlider>
  </div>
</template>
