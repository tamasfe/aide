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
</script>

<template>
  <div>
    <label v-if="title" :for="inputId" class="text-subtle">{{ title }}</label>
    <div
      class="flex items-center gap-4 rounded-default p-[8px] sm:p-[16px] focus:bg-white focus-within:outline outline-2 outline-focus w-full"
      :class="wrapperClass"
    >
      <slot name="prefix" />
      <input
        :id="inputId"
        class="flex-1 bg-inherit border-none outline-none text-[18px] font-[500] focus:placeholder:text-subtle w-full"
        v-model="modelValue"
        :placeholder="placeholder"
        :class="inputClass"
        :disabled="disabled"
        :readonly="readonly"
        @input="emit('input', $event)"
        @change="emit('change', $event)"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />
      <slot name="suffix" />
    </div>
    <div v-if="error" class="text-red-400">{{ error }}</div>
  </div>
</template>
