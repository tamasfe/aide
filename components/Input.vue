<!-- IMPROVE ANIMATION LOGIC -->
<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  inputClass?: string;
  wrapperClass?: string;
  title?: string;
  error?: string;
  disabled?: boolean;
  readonly?: boolean;
  placeholder?: string;
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
const label = ref<HTMLLabelElement | null>(null);
const input = ref<HTMLDivElement | null>(null);

const onBlur = (evt: FocusEvent) => {
  if (label.value && modelValue.value === "") {
    const left = input.value?.offsetLeft;
    const top = input.value?.offsetTop;
    if (left) {
      label.value.style.transform = `translate(${left}px, ${top}px)`;
    }
  }
  emit("focus", evt);
};

const onFocus = (evt: FocusEvent) => {
  if (label.value) {
    label.value.style.transform = `translate(0, -100%)`;
  }
  emit("blur", evt);
};

const labelStyle = ref({
  transform: "translate(0, -100%)",
});

onMounted(() => {
  if (!modelValue.value && label.value) {
    const left = input.value?.offsetLeft;
    const top = input.value?.offsetTop;
    if (left) {
      label.value.style.transform = `translate(${left}px, ${top}px)`;
    }
  }
});
</script>

<template>
  <div class="relative">
    <label
      ref="label"
      v-if="title"
      :for="inputId"
      class="text-subtle giro__input-label"
      :style="labelStyle"
      >{{ title }}</label
    >
    <div
      class="flex items-center gap-4 rounded-default p-[8px] sm:p-[16px] focus:bg-white focus-within:outline outline-2 outline-focus w-full"
      :class="wrapperClass"
    >
      <slot name="prefix" />
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
      <slot name="suffix" />
    </div>
    <div v-if="error" class="text-red-400">{{ error }}</div>
  </div>
</template>
<style scoped>
.giro__input-label {
  transition:
    transform 0.2s,
    font-size 0.2s;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
