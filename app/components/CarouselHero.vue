<script setup lang="ts">
import type { SlideData } from "~/types/slides";

const { isMobile } = useDevice();
const slideActions = useSlideActions();
const localePath = useLocalePath();

const slides = computed(() => {
  return {
    sm: 1,
    md: 1,
    lg: 2,
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
  <div class="w-full">
    <BaseCarousel
      :side-controls="!isMobile"
      :options="{ align: 'center' }"
      :slides="slides"
      :slide-count="slideData.length"
      :gap="isMobile ? 0.6 : 1"
      class="w-full overflow-hidden"
      slide-ratio="1280/607"
    >
      <div v-for="slide in slideData" :key="slide.id" class="snap-start first:pl-4 pl-3 lg:pl-4 last:pr-4 w-[calc(100%-1rem)] sm:w-[calc((100%/2)-(1rem/2))] lg:w-[calc((100%/3)-(1rem/3))] flex-shrink-0">
        <SlideGeneric
          class="w-full"
          :slide="slide"
          :fetchpriority="slide.fetchpriority"
        />
      </div>
    </BaseCarousel>
  </div>
</template>
