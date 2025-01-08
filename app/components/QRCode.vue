<template>
  <qrcode-vue
    :value="value"
    :level="level"
    render-as="svg"
    :image-settings="imageSettings"
    :size="size"
  />
</template>

<script setup lang="ts">
import QrcodeVue from "qrcode.vue";
import type { PropType } from "vue";

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  level: {
    type: String as PropType<"L" | "M" | "Q" | "H">,
    description: "More info about QR error levels at: https://en.wikipedia.org/wiki/QR_code#Error_correction",
    default: "H",
  },
  size: {
    type: Number,
    default: 200,
  },
});

const imageSettings = {
  src: "/assets/images/logos/logo-g-black-bg.png",
  height: Math.abs(props.size / 5),
  width: Math.abs(props.size / 5),
  excavate: true,
};
</script>
