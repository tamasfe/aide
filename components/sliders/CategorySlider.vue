<template>
  <div class="flex justify-center w-full mb-8">
    <div class="relative flex flex-col w-full max-w-[1232px] overflow-y-hidden">
      <div class="flex items-center place-content-between mb-4 px-4 xl:px-0">
        <h1 class="font-montserrat text-lg md:text-2xl font-semibold text-white">{{ title }}</h1>
        <div class="flex items-center gap-x-2">
          <PartialsButtonComponent
            class="hidden md:flex"
            :variant="'round'"
            :disabled="disablePrev"
            @click="onPreviousSlide()"
          >
            <IconsSliderChevronLeft
              class="h-6"
              :color="'#fff'"
            />
          </PartialsButtonComponent>
          <PartialsButtonComponent
            class="hidden md:flex"
            :variant="'round'"
            :disabled="disableNext"
            @click="onNextSlide()"
          >
            <IconsSliderChevronRight
              class="h-6"
              :color="'#fff'"
            />
          </PartialsButtonComponent>
          <PartialsButtonComponent
            class="ml-4"
            :background="'#42424D'"
            :text-color="'#B8BDCB'"
            small
          >
            VIEW ALL
          </PartialsButtonComponent>
        </div>
      </div>

      <div
        ref="slideWrapper"
        class="w-full h-auto md:h-[217px] carousel__wrapper snap-x snap-mandatory applyScrollbarHide overflow-y-hidden overflow-x-scroll whitespace-nowrap scroll-smooth"
      >
        <NuxtLink
          v-for="slide in props.slides"
          :to="slide.link"
          class="inline-block select-none snap-start h-[45vw] md:h-full px-2 overflow-hidden last:mr-0"
        >
          <div
            class="w-[35vw] md:w-[161px] relative h-full bg-repeat rounded placeholder-bg bg-[length:100%] hover:bg-[length:105%] bg-center transition-all"
          >
            <div
              class="absolute left-[6px] top-[6px] py-[5px] px-[8px] text-game-preview-label-text text-xs font-montserrat font-bold bg-game-preview-label-bg rounded"
            >
              {{ slide.label }}
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  slides: Array<any>;
  title: string;
}>();

const slideWrapper: Ref = ref(null);
const disablePrev: Ref<boolean> = ref(false);
const disableNext: Ref<boolean> = ref(false);

onMounted(() => {
  checkStartOrEnd();
});

const checkStartOrEnd = () => {
  if (slideWrapper.value.scrollLeft + slideWrapper.value.children[0].clientWidth + slideWrapper.value.clientWidth >= slideWrapper.value.scrollWidth) {
    disableNext.value = true;
  }
  else {
    disableNext.value = false;
  }

  if (slideWrapper.value.scrollLeft - slideWrapper.value.children[0].clientWidth <= 0) {
    disablePrev.value = true;
  }
  else {
    disablePrev.value = false;
  }
};

const onNextSlide = () => {
  slideWrapper.value.scrollLeft += slideWrapper.value.clientWidth / 2 + 14;
  setTimeout(() => {
    checkStartOrEnd();
  }, 350);
};

const onPreviousSlide = () => {
  slideWrapper.value.scrollLeft -= slideWrapper.value.clientWidth / 2;
  setTimeout(() => {
    checkStartOrEnd();
  }, 350);
};
</script>

<style scoped>
.carousel__wrapper {
  -webkit-overflow-scrolling: touch;
}

/* TODO: Remove when get images from BE */

.placeholder-bg {
  background-image: url(~/assets/images/placeholders/dragonsmoney.webp);
}
</style>
