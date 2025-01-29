<script setup lang="ts">
const { isMobile } = useDevice();
const userStore = useUserStore();

const showFormWelcome = computed(() => userStore.isAuthenticated !== true);

const slides = computed(() => {
  if (showFormWelcome.value) return {
    sm: 1.2,
    md: 1.2,
    lg: 1.5,
    xl: 2.2,
  };

  return {
    sm: 1.2,
    md: 1.2,
    lg: 2.5,
    xl: 3,
  };
});
</script>

<template>
  <div class="w-full" :class="{ 'sm:grid sm:grid-cols-3 space-y-[var(--giro-section-gap)] sm:space-y-0': showFormWelcome }">
    <BaseCarousel
      :side-controls="!isMobile"
      :options="{ align: 'start' }"
      :slides="slides"
      :gap="1"
      class="w-full overflow-hidden"
      :class="{ 'sm:col-span-2': showFormWelcome }"
      slide-ratio="1080/607"
    >
      <SlideAviator />
      <SlideFortuneRabbit />
      <SlideJetX />

      <SlideFortuneTiger />
      <SlideWin10K />
      <SlideChooseGiroBet />
    </BaseCarousel>
    <FormWelcome v-if="showFormWelcome" />
  </div>
</template>
