<script setup lang="ts">
const props = defineProps<{
  disabled?: boolean;
  variant?: "primary" | "secondary" | "emphasis";
  big?: boolean;
  shadow?: boolean;
  border?: boolean;
}>();

const { variant, big, shadow, border } = toRefs(props);

const getVariantClass = computed(() => {
  switch (variant.value) {
    case "secondary":
      return "bg-button-secondary hover:bg-button-secondary-hover text-button-secondary";
    case "emphasis":
      return "bg-button-emphasis hover:bg-button-emphasis-hover text-button-emphasis";
    case "primary":
      return "bg-button-primary hover:bg-button-primary-hover text-button-primary";
    default:
      return "";
  }
});

const getSizeClass = computed(() =>
  big.value ? "p-button-big font-[700]" : "p-button font-[600]",
);

const getBorderClass = computed(() => {
  if (!border.value) return "";
  switch (variant.value) {
    case "primary":
      return "giro__border-btn giro__border-btn-primary";
    case "emphasis":
      return "giro__border-btn giro__border-btn-emphasis";
    default:
      return "";
  }
});

const getShadowClass = computed(() => {
  if (!shadow.value) return "";
  switch (variant.value) {
    case "primary":
      return "giro__shadow-3d-primary";
    case "emphasis":
      return "giro__shadow-3d-emphasis";
    default:
      return "";
  }
});
</script>

<template>
  <button
    :disabled="disabled"
    class="rounded-default"
    :class="[getVariantClass, getSizeClass, getBorderClass, getShadowClass]"
  >
    <div class="flex items-center gap-x-2">
      <slot name="prefix" />
      <slot />
      <slot name="suffix" />
    </div>
  </button>
</template>

<style scoped>
.giro__shadow-3d-primary {
  -webkit-box-shadow: 0px 4px 0px var(--giro-shadow-btn-primary);
  -moz-box-shadow: 0px 4px 0px var(--giro-shadow-btn-primary);
  box-shadow: 0px 4px 0px var(--giro-shadow-btn-primary);
}

.giro__shadow-3d-emphasis {
  -webkit-box-shadow: 0px 4px 0px var(--giro-shadow-btn-emphasis);
  -moz-box-shadow: 0px 4px 0px var(--giro-shadow-btn-emphasis);
  box-shadow: 0px 4px 0px var(--giro-shadow-btn-emphasis);
}

.giro__border-btn-emphasis::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: var(--giro-border-radius);
  padding: 1px; /* control the border thickness */
  background: var(--giro-border-btn-emphasis);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

.giro__border-btn-primary::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: var(--giro-border-radius);
  padding: 1px; /* control the border thickness */
  background: var(--giro-border-btn-primary);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

.giro__border-btn {
  position: relative;
}
</style>
