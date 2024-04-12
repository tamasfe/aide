<template>
  <button
    v-if="variant === 'text'"
    class="text-base text-white font-montserrat font-bold transition-all hover:brightness-90"
    :class="{
      'px-[24px] py-[7px]': !big && !small,
      'py-[14px] min-w-[246px]': big,
      'py-[7px] px-3 min-w-auto': small
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
    class="text-base text-[#161421] bg-[#FFE649] rounded font-bold font-montserrat transition-all hover:brightness-90 disabled:brightness-50"
    :class="{
      'px-[24px] py-[7px]': !big && !small,
      'py-[14px] min-w-[246px]': big,
      'py-[5px] px-3 min-w-auto': small,
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
