<template>
  <div class="flex justify-center w-full">
    <div class="relative flex w-full max-w-[1232px] h-[200px] md:h-[472px] overflow-y-hidden">
      <div class="w-full carousel__wrapper snap-x snap-mandatory applyScrollbarHide overflow-y-hidden overflow-x-scroll whitespace-nowrap scroll-smooth rounded">
        <NuxtLink
          v-for="slide in props.slides"
          :to="slide.link"
          class="carousel__item inline-block select-none snap-start w-full h-full"
        >
          <div
            class="w-full h-full bg-contain bg-repeat"
            :style="{ backgroundImage: `url(${slide.imageUrl})` }"
          />
        </NuxtLink>
      </div>

      <button
        class="hidden md:flex items-center absolute h-full bottom-0 left-0"
        @click="onPreviousSlide()"
      >
        <IconsSliderChevronLeft />
      </button>
      <button
        class="hidden md:flex items-center absolute h-full bottom-0 right-0"
        @click="onNextSlide()"
      >
        <IconsSliderChevronRight />
      </button>

      <div class="flex gap-x-2 absolute w-full px-8 md:px-0 md:max-w-[240px] bottom-5 md:bottom-[39px] left-[50%] translate-x-[-50%]">
        <div
          v-for="(slide, index) in props.slides"
          class="transition-opacity flex-1 h-[3px] bg-[#FFE33A]"
          :class="{ 'opacity-100': activeSlide === index, 'opacity-40': activeSlide !== index }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  slides: {
    type: Array<any>,
    default: [],
  },
});

const activeSlide: Ref<number> = ref(0);
let slideElements: NodeListOf<Element>;

onMounted(() => {
  slideElements = document.querySelectorAll(".carousel__item");
});

const onNextSlide = () => {
  activeSlide.value + 1 < slideElements.length ? activeSlide.value++ : activeSlide.value = 0;
  slideElements[activeSlide.value].scrollIntoView(false);
};
const onPreviousSlide = () => {
  activeSlide.value - 1 >= 0 ? activeSlide.value-- : activeSlide.value = props.slides.length - 1;
  slideElements[activeSlide.value].scrollIntoView(false);
};
</script>

<style scoped>
.carousel__wrapper {
  -webkit-overflow-scrolling: touch;
}
</style>
