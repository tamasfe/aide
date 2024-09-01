<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

// DESIGN STATUS: ✴️
//   * dropdown width must match input width - currently AppFooter has to put a wrapper around the select to define the input widths... this is very ugly and it would be nice of the width specified on the container worked to the options. not sure which way is cleanest though. i think a width prop is kind of ugly, but i also think using JS to detect the size of the input is way uglier. and a wrapper is also ugly. wrapper seems LEAST ugly for now
//   * md must handle floating labels and all the other stuff
//   * needs to handle :disabled (and also logic) disabled:opacity-70 (THIS MUTCH MATCH md:baseInput in forms)
//   * needs to handle placeholder (THIS MUTCH MATCH md:baseInput in forms)

const selectVariants = cva(
  "flex flex-row items-center justify-start relative w-full cursor-pointer focus-visible:outline-none",
  {
    variants: {
      variant: {
        primary: "bg-emphasis text-subtle-light",
      },
      size: {
        sm: "h-9 pl-3 pr-10 text-sm rounded-default",
        md: "h-[var(--giro-field-height)] pl-4 pr-10 text-base rounded-default",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },

);
type SelectVariants = VariantProps<typeof selectVariants>;

const props = withDefaults(
  defineProps<{
    variant?: SelectVariants["variant"];
    size?: SelectVariants["size"];
    required?: boolean;
    disabled?: boolean;
    class?: HTMLAttributes["class"];
  }>(), {
    variant: "primary",
    size: "md",
    required: false,
    disabled: false,
  },
);

// TODO DEMO DATA DELETE ME
// TODO DEMO DATA DELETE ME
// TODO DEMO DATA DELETE ME
// TODO then obviously move it to a prop thats strongly typed for options
const options = [
  { id: 1, title: "Portuguese", countryCode: "BR" },
  { id: 2, title: "English", countryCode: "US" },
  { id: 3, title: "Spanish", countryCode: "ES" },
  { id: 4, title: "Spanish (Mexico)", countryCode: "MX" },
  { id: 5, title: "German", countryCode: "DE" },
];
const selectedOption = ref(options[0]);
</script>

<template>
  <Listbox
    v-slot="{ open }"
    v-model="selectedOption"
    class="w-full"
  >
    <div class="relative">
      <ListboxButton
        :class="cn(
          selectVariants({ variant, size }),
          props.class,
        )"
      >
        <slot
          v-if="$slots.selected"
          name="selected"
          v-bind="{ selected: selectedOption }"
        />
        <span
          v-else
          class="block whitespace-nowrap truncate font-medium text-left"
        >
          {{ selectedOption.title }}
        </span>
        <span class="pointer-events-none absolute z-[1] inset-y-0 right-0 flex items-center pr-2">
          <Icon
            :name="open ? 'lucide:chevron-up' : 'lucide:chevron-down'"
            aria-hidden="true"
            size="20"
            class="text-subtle"
          />
        </span>
      </ListboxButton>

      <Transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-[1] w-full mt-1 text-sm overflow-auto bg-emphasis rounded-default focus-visible:outline-none"
        >
          <ListboxOption
            v-for="option in options"
            v-slot="{ active, selected }"
            :key="option.title"
            :value="option"
            as="template"
          >
            <li
              :class="cn(
                'cursor-pointer select-none h-8 px-3 flex items-center w-full',
                active && 'bg-button-secondary-hover text-subtle-light',
                selected && 'bg-button-secondary-hover font-semibold text-emphasis',
              )"
            >
              <slot
                v-if="$slots.option"
                name="option"
                v-bind="{ option }"
              />
              <span
                v-else
                class="block font-medium truncate"
              >
                {{ option.title }}
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </Transition>
    </div>
  </Listbox>
</template>
