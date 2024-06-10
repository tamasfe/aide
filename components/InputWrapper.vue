<script setup lang="ts">
const props = defineProps<{
  title?: string;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  wrapperClass?: string;
  modelValue?: string;
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
  if (label.value && !props.modelValue) {
    label.value.classList.remove("giro__input-label-position");
  }
};

const labelToTop = () => {
  if (label.value && props.modelValue) {
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

const labelPositionClass = computed(() => {
  return props.modelValue ? "giro__input-label-position" : "";
});

const defaultSlotWrapperClass = computed(() =>
  props.title ? "pt-[28px] pb-[6px]" : "",
);

const wrapperPaddingClass = computed(() =>
  props.title ? "px-[18px]" : "p-[18px]",
);

defineExpose({
  onFocus,
  onBlur,
});
</script>

<template>
  <div ref="container" class="giro__input-container rounded-default">
    <div
      class="flex items-center gap-4 rounded-default w-full bg-emphasis focus-within:outline outline-2 outline-focus min-h-16"
      :class="[wrapperClass, wrapperPaddingClass]"
    >
      <slot name="prefix" />
      <div class="relative h-full flex-1">
        <label
          ref="label"
          v-if="title"
          :for="inputId"
          class="text-subtle font-medium giro__input-placeholder"
          :class="labelPositionClass"
        >
          {{ title }}
        </label>
        <div class="h-full" :class="defaultSlotWrapperClass">
          <slot />
        </div>
      </div>
      <slot name="suffix" />
    </div>
    <div v-if="error" class="text-red-400">{{ error }}</div>
  </div>
</template>
<style lang="postcss" scoped>
.giro__input-placeholder {
  transition: transform 0.25s cubic-bezier(0.25, 0, 0.25, 1);
  position: absolute;
  font-size: 18px;
  pointer-events: none;
  top: 50%;
  transform-origin: left top;
  transform: translateY(-50%);
  left: 0;
}

.giro__input-container:focus-within .giro__input-placeholder,
.giro__input-label-position {
  transform: translateY(-24px) scale(0.75);
}
</style>
