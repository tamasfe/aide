<script setup lang="ts">
const { isMobile } = useDevice();

/**
 * In the future show it if:
 *  1. User is not authenticated
 *  2. Split test is enabled
 */
// const userStore = useUserStore();
const showFormWelcome = ref(false);// computed(() => userStore.isAuthenticated !== true);

const slides = computed(() => {
  if (showFormWelcome.value) return {
    sm: 1.05,
    md: 1.1,
    lg: 1.5,
    xl: 2.02,
  };

  return {
    sm: 1.05,
    md: 1.1,
    lg: 2.5,
    xl: 3,
  };
});
</script>

<template>
  <div class="w-full" :class="{ 'sm:grid sm:grid-cols-3 space-y-[var(--giro-section-gap-sm)] sm:space-y-0': showFormWelcome }">
    <BaseCarousel
      :side-controls="!isMobile"
      :options="{ align: 'start' }"
      :slides="slides"
      :gap="isMobile ? 0.35 : 1"
      class="pt-2 md:pt-0 pl-4 md:pl-0 w-full overflow-hidden"
      :class="{ 'sm:col-span-2': showFormWelcome }"
      slide-ratio="1280/607"
    >
      <SlideAviator />
      <SlideMultiplyYourWinnings />
      <SlidePgSoft />
      <SlideUnlimitedWithdrawals />
      <SlideWin10K />
      <SlideWhyChooseUs />
    </BaseCarousel>
    <FormWelcome v-if="showFormWelcome" />
  </div>
</template>
