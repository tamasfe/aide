<script setup lang="ts">
import type { InputHTMLAttributes, HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";
import type { MaskInputOptions } from "maska";

const inputVariants = cva(
  "focus-visible:outline-none disabled:opacity-70",
  {
    variants: {
      variant: {
        primary: "bg-subtle text-subtle placeholder:text-subtle",
        ghost: "",
      },
      size: {
        md: "h-[var(--giro-field-height)] px-4 text-base font-medium rounded-default",
        ghost: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type InputVariants = VariantProps<typeof inputVariants>;

defineEmits<{
  input: [value: string];
  change: [value: string];
}>();

const props = withDefaults(defineProps<{
  variant?: InputVariants["variant"];
  size?: InputVariants["size"];
  type?: "text" | "password"; // "text" with X inputmode is preferred as we do our own validation
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  mask?: string | MaskInputOptions;
  maskBehaviourEager?: boolean;
  autocomplete?: InputHTMLAttributes["autocomplete"];
  autocorrect?: "off";
  inputmode?: "text" | "decimal" | "numeric" | "tel" | "search" | "email";
  class?: HTMLAttributes["class"];
}>(), {
  type: "text",
  required: false,
  disabled: false,
  autocomplete: "on",
  autocorrect: "off",
  inputmode: "text",
});

const [value, modifiers] = defineModel<string | number>({
  set(value) {
    if (modifiers.number) {
      return Number(value);
    }
    return value;
  },
});
</script>

<template>
  <input
    v-model="value"
    v-maska="mask"
    :data-maska-eager="maskBehaviourEager ?? false"
    :type="type"
    :required="required"
    :disabled="disabled"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :autocorrect="autocorrect"
    :inputmode="inputmode"
    :class="cn(
      inputVariants({ variant, size }),
      props.class,
    )"
    @input="event => $emit('input', (event.target as HTMLInputElement)?.value ?? '')"
    @change="event => $emit('change', (event.target as HTMLInputElement)?.value ?? '')"
  >
</template>

<style scoped>
  /* To remove the MacOS auto-fill styles */
  input:-webkit-autofill {
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: rgb(var(--giro-bg-text-emphasis)) !important;
    -webkit-text-stroke: unset;
  }
</style>
