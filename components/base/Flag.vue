<template>
  <div
    :class="[
      'flag',
      `size-${size}`,
      { 'border-radius': hasBorderRadius },
      { border: hasBorder },
      { 'drop-shadow': hasDropShadow },
      gradient,
      className,
    ]"
  >
    <img :src="imageUrl">
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  size: {
    type: String,
    default: "m",
    validator: (value: string) => ["s", "m", "l"].indexOf(value) !== -1,
  },
  code: {
    type: String,
    default: "AD",
  },
  hasDropShadow: {
    type: Boolean,
    default: false,
  },
  hasBorder: {
    type: Boolean,
    default: false,
  },
  hasBorderRadius: {
    type: Boolean,
    default: true,
  },
  gradient: {
    type: String,
    validator: (value: string) =>
      ["top-down", "real-linear", "real-circular"].indexOf(value) !== -1,
  },
  className: {
    type: String,
  },
});

const imageUrl = `/svg/${props.size}/${props.code}.svg`;
</script>
