<script setup lang="ts">
import { InputWrapper } from "#components";

const props = defineProps<{
  modelValue: string;
  inputClass?: string;
  wrapperClass?: string;
  title?: string;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  blurScreen?: boolean;
}>();

const emit = defineEmits([
  "update:modelValue",
  "input",
  "change",
  "focus",
  "blur",
]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const inputId = Math.random().toString(36).substring(7);
const wrapper = ref<InstanceType<typeof InputWrapper> | null>(null);

// check if this can be used as plugin, composable or utility
// overlay and hideOverlay
const overlay = () => {
  if (wrapper.value) {
    const div = document.createElement("div");
    div.classList.add("giro__overlay");
    wrapper.value.$el.style.zIndex = "3";
    wrapper.value.$el.parentElement?.appendChild(div);
  }
};

const hideOverlay = () => {
  if (wrapper.value) {
    wrapper.value.$el.style.zIndex = "";
    const overlay =
      wrapper.value.$el.parentElement?.querySelector(".giro__overlay");
    overlay?.remove();
  }
};

const onBlur = (evt: FocusEvent) => {
  if (wrapper.value && modelValue.value === "") {
    wrapper.value.onBlur(evt);
  }
  emit("blur", evt);
  if (props.blurScreen) {
    hideOverlay();
  }
};

const onFocus = (evt: FocusEvent) => {
  if (wrapper.value) {
    wrapper.value.onFocus(evt);
  }
  emit("focus", evt);
  if (props.blurScreen) {
    overlay();
  }
};
</script>

<template>
  <InputWrapper ref="wrapper" v-bind="props">
    <template #prefix>
      <slot name="prefix" />
    </template>
    <input
      :id="inputId"
      ref="input"
      class="flex-1 bg-inherit border-none outline-none text-[18px] font-[500] focus:placeholder:text-subtle w-full"
      v-model="modelValue"
      :class="inputClass"
      :disabled="disabled"
      :readonly="readonly"
      @input="emit('input', $event)"
      @change="emit('change', $event)"
      @focus="onFocus"
      @blur="onBlur"
    />
    <template #suffix>
      <slot name="suffix" />
    </template>
  </InputWrapper>
</template>
