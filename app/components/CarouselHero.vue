<script setup lang="ts">
import type { SlideData } from "~/types/slides";

const { isMobile } = useDevice();
const slideActions = useSlideActions();
const localePath = useLocalePath();

/**
 * In the future show it if:
 *  1. User is not authenticated
 *  2. Split test is enabled
 */
// const userStore = useUserStore();
const showFormWelcome = ref(false); // computed(() => userStore.isAuthenticated !== true);

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

const slideData: SlideData[] = [
  {
    id: "aviator",
    imagePath: "slides/1.png",
    alt: "Aviator Game",
    fetchpriority: "high" as const,
    action: {
      type: "link" as const,
      attributes: {
        to: localePath({
          path: "/games/spribe/aviator",
        }),
      },
    },
  },
  {
    id: "multiply-winnings",
    imagePath: "slides/2.png",
    alt: "Multiply Your Winnings",
    fetchpriority: isMobile ? ("low" as const) : ("high" as const),
    action: {
      type: "callback" as const,
      attributes: {
        onClick: slideActions.openDepositOrLogin,
      },
    },
  },
  {
    id: "pgsoft",
    imagePath: "slides/3.png",
    alt: "PG Soft Games",
    fetchpriority: isMobile ? ("low" as const) : ("high" as const),
    action: {
      type: "link" as const,
      attributes: {
        to: localePath({
          path: "/games/pgsoft",
        }),
      },
    },
  },
  {
    id: "unlimited-withdrawals",
    imagePath: "slides/4.png",
    alt: "Unlimited Withdrawals",
    fetchpriority: "low" as const,
    action: {
      type: "callback" as const,
      attributes: {
        onClick: slideActions.openWithdrawalOrRegister,
      },
    },
  },
  {
    id: "win10k",
    imagePath: "slides/5.png",
    alt: "Win 10K",
    fetchpriority: "low" as const,
    action: {
      type: "callback" as const,
      attributes: {
        onClick: slideActions.openDepositOrLogin,
      },
    },
  },
  {
    id: "why-choose-us",
    imagePath: "slides/6.png",
    alt: "Why Choose Us",
    fetchpriority: "low" as const,
    action: {
      type: "callback" as const,
      attributes: {
        onClick: slideActions.openDepositOrRegister,
      },
    },
  },
];
</script>

<template>
  <div class="w-full" :class="{ 'sm:grid sm:grid-cols-3 space-y-[var(--giro-section-gap-sm)] sm:space-y-0': showFormWelcome }">
    <BaseCarousel
      :side-controls="!isMobile"
      :options="{ align: 'center' }"
      :slides="slides"
      :gap="isMobile ? 1 : 1"
      class="w-full overflow-hidden"
      :class="{ 'sm:col-span-2': showFormWelcome }"
      slide-ratio="1280/607"
    >
      <SlideGeneric
        v-for="slide in slideData"
        :key="slide.id"
        :slide="slide"
        :fetchpriority="slide.fetchpriority"
      />
    </BaseCarousel>
    <FormWelcome v-if="showFormWelcome" />
  </div>
</template>
