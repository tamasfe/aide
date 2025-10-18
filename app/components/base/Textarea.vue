<script setup lang="ts">
import type { InputHTMLAttributes, HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";
import type { MaskInputOptions } from "maska";
import { vMaska } from "maska/vue";

const inputVariants = cva(
  "focus-visible:outline-none disabled:opacity-70",
  {
    variants: {
      variant: {
        primary: "bg-subtle text-subtle placeholder:text-subtle",
        ghost: "",
      },
      size: {
        ghost: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "ghost",
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
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  mask?: string | MaskInputOptions;
  maskBehaviourEager?: boolean;
  autocomplete?: InputHTMLAttributes["autocomplete"];
  autocorrect?: "off";
  inputmode?: "text" | "decimal" | "numeric" | "tel" | "search" | "email";
  class?: HTMLAttributes["class"];
  allowResize?: boolean;
}>(), {
  rows: 5,
  type: "text",
  required: false,
  disabled: false,
  autocomplete: "on",
  autocorrect: "off",
  inputmode: "text",
  allowResize: false,
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
  <textarea
    v-model="value"
    v-maska="mask"
    :data-maska-eager="maskBehaviourEager ?? false"
    :required="required"
    :disabled="disabled"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :autocorrect="autocorrect"
    :inputmode="inputmode"
    :class="cn(
      inputVariants({ variant, size }),
      props.class,
      { 'resize-none': allowResize !== true },
    )"

    @input="event => $emit('input', (event.target as HTMLTextAreaElement)?.value ?? '')"
    @change="event => $emit('change', (event.target as HTMLTextAreaElement)?.value ?? '')"
  />
</template>

<style scoped>
  /* To remove the MacOS auto-fill styles */
  input:-webkit-autofill {
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: rgb(var(--color-bg-text-emphasis)) !important;
    -webkit-text-stroke: unset;
  }
</style>
