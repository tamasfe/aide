<template>
  <div class="flex justify-center w-full">
    <div class="relative flex w-full max-w-[1232px] h-[472px] overflow-y-hidden">
      <div class="w-full carousel__wrapper scrollbar-hide overflow-hidden rounded">
        <div class="carousel__item select-none w-full h-full">
          <div class="carousel__item--bg w-full h-full"></div>
        </div>
        <div class="carousel__item select-none w-full h-full">
          <div class="carousel__item--bg w-full h-full"></div>
        </div>
        <div class="carousel__item select-none w-full h-full">
          <div class="carousel__item--bg w-full h-full"></div>
        </div>
      </div>

      <button class="flex items-center absolute h-full bottom-0 left-0" @click="onPreviousSlide()">
        <IconsSliderChevroneLeft />
      </button>
      <button class="flex items-center absolute h-full bottom-0 right-0" @click="onNextSlide()">
        <IconsSliderChevroneRight />
      </button>

      <div class="flex gap-x-2 absolute w-full max-w-[240px] bottom-[39px] left-[50%] translate-x-[-50%]">
        <div v-for="slide in maxSlides" class="carousel__selector flex-1 h-[2px] bg-[#FFE33A] opacity-40" :class="{ active: activeSlide === slide - 1}">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
let activeSlide:Ref<number> = ref(0);
let maxSlides:Ref<number> = ref(0);
let slides:NodeListOf<Element>;

onMounted(() => {
  slides = document.querySelectorAll('.carousel__item');
  maxSlides.value = slides.length;
})

const onNextSlide = () => {
  activeSlide.value + 1 < slides.length ? activeSlide.value++ : activeSlide.value = 0
  slides[activeSlide.value].scrollIntoView(false)
}
const onPreviousSlide = () => {
  activeSlide.value - 1 >= 0 ? activeSlide.value-- : activeSlide.value = maxSlides.value - 1
  slides[activeSlide.value].scrollIntoView(false)
}
</script>

<style lang="scss" scoped>
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.carousel {
  &__wrapper {
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
    overflow-x: scroll;
    scroll-behavior: smooth;

    & > .carousel__item {
      width: 100%;
      display: inline-block;
      scroll-snap-align: start;

      & .carousel__item--bg {
        background-image: url('/images/slider-bg.png');
        background-size: contain;
      }
    }
  }
  &__selector {
    transition: opacity .35s ease;
    &.active {
      opacity: 1;
    }
  }
}
</style>
