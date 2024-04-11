<template>
  <div class="flex justify-center w-full mb-8">
    <div class="relative flex flex-col w-full max-w-[1232px] overflow-y-hidden">
      <div class="flex place-content-between mb-4">
        <h1 class="font-montserrat text-2xl font-bold text-white">{{ title }}</h1>
        <div class="flex items-center gap-x-2">
          <PartialsButtonComponent :variant="'round'" @click="onPreviousSlide()" :disabled="disablePrev">
            <IconsSliderChevronLeft class="h-6" :color="'#fff'"/>
          </PartialsButtonComponent>
          <PartialsButtonComponent :variant="'round'" @click="onNextSlide()" :disabled="disableNext">
            <IconsSliderChevronRight class="h-6" :color="'#fff'"/>
          </PartialsButtonComponent>
          <PartialsButtonComponent class="ml-4" :background="'#42424D'" :color="'#B8BDCB'" small :label="'VIEW ALL'"/>
        </div>
      </div>
      
      <div
        ref="slideWrapper"
        class="w-full h-[217px] carousel__wrapper snap-x snap-mandatory scrollbar-hide overflow-y-hidden overflow-x-scroll whitespace-nowrap scroll-smooth rounded"
      >
        <NuxtLink v-for="slide in props.slides" :to="slide.link"  class="inline-block select-none snap-start w-[161px] h-full mr-[18px] rounded last:mr-0">
          <div class="relative w-full h-full bg-contain bg-repeat" :style="{backgroundImage: `url(${slide.imageUrl})`}">
            <div class="absolute left-[6px] top-[6px] py-[5px] px-[8px] text-white text-xs font-montserrat font-bold bg-[#00B439] rounded">
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
  slides: Array<any>,
  title: String
}>()

const slideWrapper:Ref = ref(null)
let disablePrev:Ref<boolean> = ref(false)
let disableNext:Ref<boolean> = ref(false)

onMounted(() => {
  checkStartOrEnd()
})

const checkStartOrEnd = () => {
  if (slideWrapper.value.scrollLeft + slideWrapper.value.children[0].clientWidth + slideWrapper.value.clientWidth >= slideWrapper.value.scrollWidth) {
    disableNext.value = true
  } else {
    disableNext.value = false
  }

  if(slideWrapper.value.scrollLeft - slideWrapper.value.children[0].clientWidth <= 0) {
    disablePrev.value = true
  } else {
    disablePrev.value = false
  }
}

const onNextSlide = () => {
  slideWrapper.value.scrollLeft += slideWrapper.value.children[0].clientWidth
  setTimeout(() => {
    checkStartOrEnd()
  }, 350)
}

const onPreviousSlide = () => {
  slideWrapper.value.scrollLeft -= slideWrapper.value.children[0].clientWidth
  setTimeout(() => {
    checkStartOrEnd()
  }, 350)
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
    -webkit-overflow-scrolling: touch;
  }
}
</style>
