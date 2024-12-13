<script setup lang="ts" generic="O extends {
  id?: string;
  disabled?: boolean;
  value: string;
  title: string;
}"
>
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton,
} from "@headlessui/vue";
import type { PropType } from "vue";
import { type VariantProps, cva } from "class-variance-authority";

withDefaults(
  defineProps<{
    options: O[];
    variant?: ComboboxVariants["variant"];
    size?: ComboboxVariants["size"];
  }>(), {
    variant: "subtle",
    size: "md",
  },
);
;

const query = defineModel("query", { type: String, required: true });
const selectedOption = defineModel("selected", { type: Object as PropType<O>, required: false });

/**
   * Design
   */
const comboboxVariants = cva(
  "cursor-pointer focus-visible:outline-none focus:outline-none",
  {
    variants: {
      variant: {
        subtle: "text-subtle-light font-medium bg-button-subtle hover:bg-button-subtle-hover focus:bg-button-subtle",
        ghost: "",
      },
      size: {
        md: "h-[var(--giro-field-height)] px-4 text-sm sm:text-base rounded-default",
        ghost: "",
      },
    },
    defaultVariants: {
      variant: "subtle",
      size: "md",
    },
  },
);
type ComboboxVariants = VariantProps<typeof comboboxVariants>;
</script>

<template>
  <Combobox
    v-slot="{ open }"
    v-model="selectedOption"
    as="div"
    @update:model-value="query = ''"
  >
    <div class="relative mt-2">
      <div class="flex items-center justify-between">
        <ComboboxInput
          :class="cn('w-full block rounded-r-none', comboboxVariants({ size, variant }))"
          :display-value="(option) => (option as O)?.title"
          inputmode="text"
          autocorrect="off"
          @change="query = $event.target.value"
          @blur="query = ''"
        />
        <ComboboxButton
          :class="cn('right-0 flex h-full items-center rounded-r-md rounded-l-none px-py-4', comboboxVariants({ variant, size }))"
          @click="open ? undefined : query = '' "
        >
          <BaseIcon
            v-if="open"
            aria-hidden="true"
            name="lucide:chevron-up"
            :size="20"
          />
          <BaseIcon
            v-if="!open"
            aria-hidden="true"
            name="lucide:chevron-down"
            :size="20"
          />
        </ComboboxButton>
      </div>

      <ComboboxOptions
        v-if="options.length > 0"
        :class="cn('mt-1 max-h-60 w-full overflow-auto py-1 shadow-lg ring-1 ring-black/5', comboboxVariants({ variant, size }), 'px-0 h-max')"
      >
        <ComboboxOption
          v-for="option in options"
          :key="option.id"
          v-slot="{ active, selected }"
          :value="option"
          as="template"
        >
          <li :class="cn(comboboxVariants({ variant, size }), 'py-3 h-fit relative rounded-none cursor-default select-none', active ? 'bg-button-subtle-hover' : '')">
            <span :class="['block truncate', selected && 'font-bold']">
              {{ option.title }}
            </span>

            <span
              v-if="selected"
              class="bg-transparent absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none"
              :class="cn(comboboxVariants({ variant, size: null }))"
            >
              <BaseIcon aria-hidden="true" name="lucide:check" :size="18" />
            </span>
          </li>
        </ComboboxOption>
      </ComboboxOptions>
    </div>
  </Combobox>
</template>

<style scoped>

</style>
