<template>
  <div class="flex justify-center w-full mb-8">
    <div class="relative flex flex-col w-full max-w-[1232px]  overflow-y-hidden">
      <div class="flex place-content-between mb-4 px-4 xl:px-0">
        <h1 class="font-montserrat text-2xl font-bold text-white">👾 Providers</h1>
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
        class="w-full h-[184px] carousel__wrapper snap-x snap-mandatory applyScrollbarHide overflow-y-hidden overflow-x-scroll whitespace-nowrap scroll-smooth rounded"
      >
        <NuxtLink
          v-for="slide in props.slides"
          :to="slide.link"
          class="inline-block select-none snap-start h-full pr-4 first:pl-4 xl:first:pl-0 xl:pr-0 xl:mr-[18px] rounded last:mr-0"
        >
          <div class="inline-flex flex-col w-[233px]">
            <div class="flex justify-center w-full flex-1 p-[26px] bg-providers-slider-logo-bg">
              <img src="/providers/platipus.svg">
            </div>
            <div class="bg-providers-title-bg p-[14px] text-providers-title text-center font-montserrat text-sm">
              <p>{{ slide.title }}</p>
              <p>({{ slide.gamesCount }} games)</p>
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
  slideWrapper.value.scrollLeft += slideWrapper.value.children[0].clientWidth;
  setTimeout(() => {
    checkStartOrEnd();
  }, 350);
};

const onPreviousSlide = () => {
  slideWrapper.value.scrollLeft -= slideWrapper.value.children[0].clientWidth;
  setTimeout(() => {
    checkStartOrEnd();
  }, 350);
};
</script>

<style scoped>
.carousel__wrapper {
  -webkit-overflow-scrolling: touch;
}
</style>
