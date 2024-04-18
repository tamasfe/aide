<template>
  <button
    class="flex justify-center items-center text-xs md:text-base font-montserrat font-bold transition-all hover:brightness-90 rounded disabled:brightness-75"
    :class="{
      'py-[7px] px-[12px]': !big && !small && variant !== 'round',
      'py-[5px] md:p-[14px]': big,
      'py-[5px] px-[6px] md:p-[7px]': small,
      'text-text-button': variant === 'text',
      'text-button-base-text bg-button-base': color === 'base' && variant !== 'text',
      'text-button-secondary-text bg-button-secondary': color === 'secondary' && variant !== 'text',
      'w-8 h-8 rounded-full pt-0 pb-0 pr-0 pl-0': variant === 'round',
      'w-8 h-8': variant === 'square',
    }"
    :style="{
      color: textColor,
      backgroundColor: background,
    }"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps({
  variant: {
    type: String,
    default: "solid",
  },
  big: {
    type: [Boolean, String],
    default: false,
  },
  small: {
    type: [Boolean, String],
    default: false,
  },
  background: {
    type: String,
    default: "",
  },
  textColor: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "base",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>
