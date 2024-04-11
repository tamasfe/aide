<template>
  <button
    v-if="variant === 'text'"
    class="text-base text-white font-montserrat font-bold"
    :class="{
      'px-[24px] py-[7px]': !big && !small,
      'py-[14px] min-w-[246px]': big,
      'py-[7px] px-3 min-w-auto': small
    }"
    :style="{
      color: color,
    }"
  >
    {{ label }}
  </button>
  
  <button
    v-else-if="variant === 'solid'"
    class="text-base text-[#161421] bg-[#FFE649] rounded font-bold font-montserrat"
    :class="{
      'px-[24px] py-[7px]': !big && !small,
      'py-[14px] min-w-[246px]': big,
      'py-[7px] px-3 min-w-auto': small,
    }"
    :style="{
      color: color,
      backgroundColor: background
    }"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
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
  }
})
</script>

<style lang="scss" scoped>

</style>
