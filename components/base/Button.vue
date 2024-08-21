<script setup lang="ts">
type Variant = "primary" | "secondary" | "emphasis";
const props = withDefaults(defineProps<{
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  big?: boolean;
  shadow?: boolean;
  border?: boolean;
}>(), {
  loading: false,
  disabled: false,
  big: false,
  shadow: false,
  border: false,
});

const { variant, big, shadow, border } = toRefs(props);

const VARIANT_CLASSES = {
  primary:
    "bg-button-primary hover:bg-button-primary-hover text-button-primary",
  secondary:
    "bg-button-secondary hover:bg-button-secondary-hover text-button-secondary",
  emphasis:
    "bg-button-emphasis hover:bg-button-emphasis-hover text-button-emphasis",
};

const BORDER_CLASSES: Partial<Record<Variant, string>> = {
  primary: "giro__border-btn giro__border-btn-primary",
  emphasis: "giro__border-btn giro__border-btn-emphasis",
};

const SHADOW_CLASSES: Partial<Record<Variant, string>> = {
  primary: "giro__shadow-3d-primary",
  emphasis: "giro__shadow-3d-emphasis",
};
const getVariantClass = computed(() =>
  variant.value ? VARIANT_CLASSES[variant.value] : "",
);

const getSizeClass = computed(() =>
  big.value ? "p-button-big font-bold text-lg" : "p-button font-semibold",
);

const getBorderClass = computed(() => {
  if (border.value && variant.value) {
    return BORDER_CLASSES[variant.value];
  }
  return "";
});

const getShadowClass = computed(() => {
  if (shadow.value && variant.value) {
    return SHADOW_CLASSES[variant.value];
  }
  return "";
});
</script>

<template>
  <button
    :disabled="disabled || loading"
    class="rounded-default outline-none select-none whitespace-nowrap disabled:pointer-events-none"
    :class="[
      { 'opacity-70': disabled || loading },
      getVariantClass,
      getSizeClass,
      getBorderClass,
      getShadowClass,
    ]"
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
