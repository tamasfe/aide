<script setup lang="ts">
const props = defineProps<{
  title?: string;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  wrapperClass?: string;
  modelValue?: string;
  animate?: boolean;
}>();

const emit = defineEmits([
  "update:modelValue",
  "input",
  "change",
  "focus",
  "blur",
]);

const inputId = Math.random().toString(36).substring(7);
const label = ref<HTMLLabelElement | null>(null);
const container = ref<HTMLDivElement | null>(null);

const labelToPlaceholder = () => {
  if (label.value && props.animate && !props.modelValue) {
    label.value.classList.remove("giro__input-label-position");
  }
};

const labelToTop = () => {
  if (label.value && props.animate && props.modelValue) {
    label.value.classList.add("giro__input-label-position");
  }
};

const onBlur = (evt: FocusEvent) => {
  labelToPlaceholder();
  emit("focus", evt);
};

const onFocus = (evt: FocusEvent) => {
  labelToTop();
  emit("blur", evt);
};

const labelClass = computed(() => {
  if (props.modelValue && props.animate) {
    return "giro__input-label giro__input-label-position";
  } else if (props.modelValue) {
    return "hidden";
  } else if (props.animate) {
    return "giro__input-label";
  } else {
    return "giro__input-placeholder";
  }
});

const wrapperPaddingClass = computed(() =>
  props.animate ? "px-[18px]" : "p-[18px]",
);

const labelWrapperClass = computed(() =>
  props.animate ? "pt-[28px] pb-[6px]" : "",
);

defineExpose({
  onFocus,
  onBlur,
});
</script>

<template>
  <div
    ref="container"
    class="giro__input-container bg-emphasis rounded-default focus-within:outline outline-2 outline-focus"
  >
    <div
      class="flex items-center gap-4 rounded-default w-full"
      :class="[wrapperClass, wrapperPaddingClass]"
    >
      <slot name="prefix" />
      <div class="relative h-full">
        <label
          ref="label"
          v-if="title"
          :for="inputId"
          class="text-subtle font-medium"
          :class="labelClass"
        >
          {{ title }}
        </label>
        <div :class="labelWrapperClass">
          <slot />
        </div>
      </div>
      <slot name="suffix" />
    </div>
    <div v-if="error" class="text-red-400">{{ error }}</div>
  </div>
</template>
<style lang="postcss" scoped>
/* Duplicate styling check for rm */
.giro__input-placeholder {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  font-size: 18px;
  pointer-events: none;
}

.giro__input-container:focus-within .giro__input-placeholder {
  display: none;
}

.giro__input-label {
  transition: all 0.2s;
  position: absolute;
  font-size: 18px;
  pointer-events: none;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
}

.giro__input-container:focus-within .giro__input-label,
.giro__input-label-position {
  @apply text-sm;
  top: 10%;
  transform: translateY(0);
  left: 0;
}
</style>
