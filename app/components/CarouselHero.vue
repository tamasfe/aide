<script setup lang="ts">
import type { SlideData } from "~/types/slides";

const { isMobile } = useDevice();
const slideActions = useSlideActions();
const localePath = useLocalePath();

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
  <BaseCarousel
    :side-controls="!isMobile"
    :options="{ align: 'center' }"
    :slide-count="slideData.length"
    class="overflow-hidden"
    slide-ratio="1280/607"
  >
    <div v-for="(slide, index) in slideData" :key="slide.id" class="flex-shrink-0 snap-start w-[calc((100%-(var(--gap)*(var(--cols)-1)))/var(--cols))]">
      <SlideGeneric
        class="w-full"
        :slide="slide"
        :fetchpriority="isMobile ? (index == 0 ? 'high' : 'low') : (index <= 3 ? 'high' : 'low')"
      />
    </div>
  </BaseCarousel>
</template>
