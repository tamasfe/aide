<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const open = ref(true);

const promoBarVariants = cva(
  "min-h-10 lg:min-h-12 relative w-full flex flex-row items-center justify-center",
  {
    variants: {
      variant: {
        purple: "bg-promo-purple text-promo-purple",
      },
    },
    defaultVariants: {
      variant: "purple",
    },
  },
);

type PromoBarVariants = VariantProps<typeof promoBarVariants>;

const props = withDefaults(defineProps<{
  variant?: PromoBarVariants["variant"];
  class?: HTMLAttributes["class"];
}>(), {
  variant: "purple",
});
</script>

<template>
  <Transition name="slide">
    <div
      v-if="open"
      :class="cn(
        promoBarVariants({ variant }),
        props.class,
      )"
    >
      <div class="px-3 py-2 mr-10 text-[0.8rem] md:text-[0.9rem] font-medium leading-tight text-left">
        {{ $t("promo_bar.refer") }}
      </div>
      <BaseButton
        variant="ghost"
        size="ghost"
        class="p-2 absolute right-1"
        @click="open = false"
      >
        <BaseIcon
          name="lucide:x"
          :size="20"
        />
      </BaseButton>
    </div>
  </Transition>
</template>
