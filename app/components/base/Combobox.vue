<script setup lang="ts" generic="O extends {
  id?: string
  disabled?: boolean
  value: string
  title: string
}"
>
import type { HTMLAttributes } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import {
  ComboboxRoot,
  ComboboxInput,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxViewport,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxAnchor,
} from "reka-ui";

withDefaults(
  defineProps<{
    options: O[];
    variant?: ComboboxVariants["variant"];
    size?: ComboboxVariants["size"];
    class?: HTMLAttributes["class"];
  }>(),
  { variant: "subtle", size: "md" },
);

const selectedOption = defineModel({ type: String, required: false });

/** Design variants */
const comboboxVariants = cva(
  "cursor-pointer focus-visible:outline-none focus:outline-none",
  {
    variants: {
      variant: {
        subtle:
          "text-subtle-light font-medium bg-button-subtle hover:bg-button-subtle-hover focus:bg-button-subtle",
        ghost: "",
      },
      size: {
        md: "h-[var(--giro-field-height)] px-4 text-sm sm:text-base rounded",
        ghost: "",
      },
    },
    defaultVariants: { variant: "subtle", size: "md" },
  },
);
type ComboboxVariants = VariantProps<typeof comboboxVariants>;
</script>

<template>
  <ComboboxRoot v-slot="{ open }" v-model="selectedOption" class="relative">
    <ComboboxAnchor class="flex items-center justify-between">
      <ComboboxInput
        :class="cn(comboboxVariants({ size, variant }), 'w-full py-4 block rounded-r-none')"
      />

      <ComboboxTrigger
        :class="cn(comboboxVariants({ variant, size }), 'px-4 py-4 h-full rounded-r rounded-l-none')"
        type="button"
      >
        <BaseIcon :name="open ? 'lucide:chevron-up' : 'lucide:chevron-down'" :size="18" aria-hidden="true" />
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxContent
      :force-mount="true"
      class="mt-2 bg-subtle max-h-60 w-full overflow-auto py-1 shadow-lg
                   text-sm text-subtle rounded px-0 h-max z-50"
    >
      <ComboboxViewport>
        <ComboboxItem
          v-for="option in options"
          :key="option.id ?? option.value"
          :value="option.value"
          :text-value="option.title"
          :disabled="!!option.disabled"
          class="py-3 h-fit relative rounded-none select-none
                       cursor-pointer px-4
                       data-[highlighted]:bg-button-subtle-hover
                       data-[state=checked]:font-bold"
        >
          <span class="block truncate">{{ option.title }}</span>
          <ComboboxItemIndicator
            class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none"
          >
            <BaseIcon aria-hidden="true" name="lucide:check" :size="18" />
          </ComboboxItemIndicator>
        </ComboboxItem>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>

<style>
/* Simple enter/leave animation */
.select-fade-enter-active,
.select-fade-leave-active {
  transition: opacity .16s ease, transform .16s cubic-bezier(.16,1,.3,1);
}
.select-fade-enter-from,
.select-fade-leave-to {
  opacity: 0;
  transform: translateY(2%) scale(.98);
}
</style>
