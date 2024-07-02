<script setup lang="ts">
export type InputWrapperProps = {
  title?: string;
  disabled?: boolean;
  placeholder?: string;
  wrapperClass?: string;
  modelValue?: unknown;
};

const props = defineProps<InputWrapperProps>();

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

const onBlur = () => {
  labelToPlaceholder();
  emit("blur");
};

const onFocus = () => {
  labelToTop();
  emit("focus");
};

const labelPositionClass = computed(() => {
  return props.modelValue ? "giro__input-label-position" : "";
});

const defaultSlotWrapperClass = computed(() => (props.title ? "pt-4" : ""));

// magic numbers because of the padding
// of the input when label is present
// check if it can be improved
const wrapperPaddingClass = computed(() =>
  props.title ? "py-0.5 sm:py-1.5" : "py-1 sm:py-[0.8rem]",
);

defineExpose({
  onFocus,
  onBlur,
});
</script>

<template>
  <div
    ref="container"
    class="giro__input-container rounded-[0.8rem]"
    @click="onFocus"
  >
    <div
      class="flex items-center gap-4 rounded-[0.8rem] w-full bg-emphasis focus-within:outline outline-2 outline-focus min-h-12 p-[0.8rem]"
      :class="[wrapperClass, wrapperPaddingClass]"
    >
      <slot name="prefix" />
      <div
        class="relative h-full flex-1"
        :class="defaultSlotWrapperClass"
      >
        <label
          v-if="title"
          ref="label"
          :for="inputId"
          class="text-subtle font-medium giro__input-placeholder"
          :class="labelPositionClass"
        >
          {{ title }}
        </label>
        <div class="h-full">
          <slot />
        </div>
      </div>
      <slot name="suffix" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.giro__input-placeholder {
  transition: transform 0.25s cubic-bezier(0.25, 0, 0.25, 1);
  position: absolute;
  pointer-events: none;
  top: 50%;
  transform-origin: left top;
  transform: translateY(-50%);
  left: 0;
}

.giro__input-container:focus-within .giro__input-placeholder,
.giro__input-label-position {
  transform: translateY(-1.429rem) scale(0.75);
}
</style>
