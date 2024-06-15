<script setup lang="ts">
import { BaseInputWrapper } from "#components";

export type InputProps = {
  modelValue?: string;
  inputClass?: string;
  wrapperClass?: string;
  title?: string;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
  blurScreen?: boolean;
  scrollIntoView?: boolean;
  type?: string;
  required?: boolean;
};

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  required: false,
});

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
const wrapper = ref<InstanceType<typeof BaseInputWrapper> | null>(null);
const input = ref<HTMLInputElement | null>(null);

// check if this can be used as plugin, composable or utility
// overlay and hideOverlay
const overlay = () => {
  if (wrapper.value) {
    const div = document.createElement("div");
    div.classList.add("giro__overlay");
    wrapper.value.$el.style.zIndex = "12";
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
  input.value?.blur();
  emit("blur", evt);
  if (props.blurScreen) {
    hideOverlay();
  }
};

const onFocus = (evt: FocusEvent) => {
  input.value?.focus();
  emit("focus", evt);
  if (props.scrollIntoView) {
    wrapper.value?.$el?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }
  if (props.blurScreen) {
    overlay();
  }
};

const focus = () => {
  if (input.value) {
    input.value.focus();
  }
};

const blur = () => {
  if (input.value) {
    input.value.blur();
  }
};

const placeholder = computed(() => {
  return props.title ? undefined : props.placeholder;
});

defineExpose({
  focus,
  blur,
});
</script>

<template>
  <BaseInputWrapper
    ref="wrapper"
    class="relative"
    :title="title"
    :wrapperClass="wrapperClass"
    :disabled="disabled"
    :placeholder="placeholder"
    :modelValue="modelValue"
    @focus="onFocus"
    @blur="onBlur"
  >
    <template #prefix>
      <slot name="prefix" />
    </template>
    <input
      :id="inputId"
      ref="input"
      class="flex-1 bg-inherit border-none outline-none text-[18px] font-[500] placeholder:text-subtle w-full"
      v-model="modelValue"
      :class="inputClass"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      :type="type"
      :required="required"
      :aria-required="required"
      autocomplete="on"
      @input="emit('input', $event)"
      @change="emit('change', $event)"
      @focus="onFocus"
      @blur="onBlur"
    />
    <template #suffix>
      <slot name="suffix" />
    </template>
  </BaseInputWrapper>
</template>
