<template>
  <button
    v-if="variant === 'text'"
    class="text-sm md:text-base text-white font-montserrat font-bold transition-all hover:brightness-90"
    :class="{
      'px-0 py-0 md:px-[24px] md:py-[7px]': !big && !small,
      'py-[5px] md:py-[14px] min-w-[246px]': big,
      'py-[5px] px-[6px] md:py-[7px] md:px-3 min-w-auto': small
    }"
    :style="{
      color: color,
    }"
    :disabled="disabled"
  >
    {{ label }}
  </button>
  
  <button
    v-else-if="variant === 'solid'"
    class="text-sm md:text-base text-[#161421] bg-[#FFE649] rounded font-bold font-montserrat transition-all hover:brightness-90 disabled:brightness-50"
    :class="{
      'px-3 py-[7px] md:px-[24px] md:py-[7px]': !big && !small,
      'py-[5px] md:py-[14px] px-3 min-w-[246px]': big,
      'py-[5px] px-[6px] md:py-[7px] md:px-3 min-w-auto': small,
    }"
    :style="{
      color: color,
      backgroundColor: background
    }"
    :disabled="disabled"
  >
    {{ label }}
  </button>

  <button
    v-else-if="variant === 'round'"
    class="flex justify-center items-center w-8 h-8 text-white bg-[#42424D] rounded-full transition-all hover:brightness-90 disabled:brightness-50"
    :style="{
      backgroundColor: background
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
    default: 'solid'
  },
  label: String,
  big: {
    type: [Boolean, String],
    default: false
  },
  small: {
    type: [Boolean, String],
    default: false
  },
  background: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>
