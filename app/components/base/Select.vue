<script setup lang="ts" generic="T extends {
  id?: string
  value: string
  title: string
  disabled?: boolean
}"
>
import { ref } from "vue";
import type { HTMLAttributes } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import {
  SelectRoot,
  SelectTrigger,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemText,
  SelectItemIndicator,
  SelectIcon,
  SelectValue,
  SelectPortal,
  SelectScrollDownButton,
} from "reka-ui";

const selectVariants = cva(
  "flex flex-row items-center justify-start relative w-full",
  {
    variants: {
      variant: {
        primary: "bg-emphasis text-subtle-light",
        secondary: "bg-button-secondary hover:bg-button-secondary-hover text-button-secondary",
        subtle: "bg-button-subtle hover:bg-button-subtle-hover text-subtle-light",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded",
        md: "h-[var(--giro-field-height)] px-4 text-base rounded",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
type SelectVariants = VariantProps<typeof selectVariants>;

type OptionsOffset = { right?: number; left?: number; top?: number; bottom?: number };

const emit = defineEmits<{ (e: "change", value: T): void }>();

const props = withDefaults(defineProps<{
  options: T[];
  variant?: SelectVariants["variant"];
  size?: SelectVariants["size"];
  optionsOffset?: OptionsOffset;
  required?: boolean;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
  containerClass?: HTMLAttributes["class"];
  placeholder?: string;
}>(), {
  variant: "primary",
  size: "md",
  required: false,
  disabled: false,
  placeholder: "",
});

const selectedOption = defineModel<T | undefined>();

// Reka Select supports object values; compare by "value" field so v-model works with T
const by = "value" as const; // or (a,b)=>a?.value===b?.value

// Open state to flip the chevron
const open = ref(false);

const onUpdateModelValue = (value: T | undefined) => {
  if (!value) return;
  if (selectedOption.value?.value !== value.value) {
    selectedOption.value = value;
    emit("change", value);
  }
};
</script>

<template>
  <div>
    <SelectRoot
      v-model="selectedOption"
      v-model:open="open"
      :by="by"
      :required="required"
      :disabled="disabled"
      @update:model-value="onUpdateModelValue"
    >
      <SelectTrigger
        :disabled="disabled"
        :class="cn(
          selectVariants({ variant, size }),
          disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer',
          'gap-2 relative',
          props.class,
          open ? 'rounded-b-none' : 'rounded-b',
        )"
      >
        <template v-if="$slots.selected">
          <slot name="selected" :selected="selectedOption" />
        </template>

        <SelectValue v-else class="min-w-3 block whitespace-nowrap truncate font-medium text-left" />

        <SelectIcon as-child>
          <BaseIcon
            :name="open ? 'lucide:chevron-up' : 'lucide:chevron-down'"
            :size="18"
            class="text-subtle ml-auto"
          />
        </SelectIcon>
      </SelectTrigger>

      <SelectPortal>
        <SelectContent
          position="popper"
          position-strategy="absolute"
          align="end"
          class="rounded-b bg-emphasis text-sm text-subtle w-[var(--reka-popper-anchor-width)]
                   focus-visible:outline-none overflow-hidden border border-muted/5 shadow-xl z-30"
        >
          <SelectViewport :class="containerClass">
            <SelectItem
              v-for="option in options"
              :key="option.id ?? option.value"
              :value="option"
              :text-value="option.title"
              :disabled="!!option.disabled"
              class="cursor-pointer select-none h-8 px-3 flex items-center gap-3 w-full
                       data-[highlighted]:outline-none
                       data-[highlighted]:bg-button-secondary-hover
                       data-[highlighted]:text-subtle-light
                       data-[state=checked]:bg-button-secondary-hover
                       data-[state=checked]:font-semibold
                       data-[state=checked]:text-emphasis"
            >
              <SelectItemText v-if="$slots.option">
                <slot name="option" :option="option" />
              </SelectItemText>
              <SelectItemText v-else class="block font-medium truncate">
                {{ option.title }}
              </SelectItemText>
              <SelectItemIndicator class="ml-auto">
                <BaseIcon
                  name="lucide:check"
                  :size="14"
                  class="text-inherit"
                />
              </SelectItemIndicator>
            </SelectItem>
          </SelectViewport>
          <SelectScrollDownButton class="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
            <BaseIcon name="lucide:chevron-down" :size="14" />
          </SelectScrollDownButton>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>

<style>
/* Simple appear/leave animation via Vue <Transition> (works per Reka guide) */
.select-fade-enter-active,
.select-fade-leave-active {
  transition: opacity .16s ease;
}
.select-fade-enter-from,
.select-fade-leave-to {
  opacity: 0;
}
</style>
