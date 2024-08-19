<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import { PhX } from "@phosphor-icons/vue";

const emit = defineEmits(["update:opened", "close"]);

type Size =
  | "full"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl"
  | "7xl"
  | "8xl"
  | "9xl"
  | "10xl";

const props = withDefaults(
  defineProps<{
    opened: boolean;
    center?: boolean;
    close?: boolean;
    closeOnClickOutside?: boolean;
    size?: Size;
  }>(),
  {
    center: false,
    size: "lg",
    close: true,
    closeOnClickOutside: true,
  },
);

const opened = computed({
  get: () => props.opened,
  set: (value) => {
    emit("update:opened", value);
  },
});

const positionClass = computed(() => {
  if (props.center) {
    return "mx-auto min-h-0 self-center";
  }
  else {
    return "mx-auto min-h-0 h-full sm:h-max";
  }
});

const MODAL_SIZES = {
  full: "w-full",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  "8xl": "max-w-8xl",
  "9xl": "max-w-9xl",
  "10xl": "max-w-10xl",
};

const size = computed(() => {
  if (props.size) {
    return MODAL_SIZES[props.size];
  }
  return "max-w-lg";
});

const closeModal = (isManuallyTriggered: boolean) => {
  if (props.closeOnClickOutside || isManuallyTriggered) {
    opened.value = false;
    emit("close");
  }
};

// TODO: make teleport to body work

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <TransitionRoot
    appear
    :show="opened"
    as="template"
  >
    <Dialog
      v-model:open="opened"
      as="div"
      class="relative z-10"
      @close="closeModal(false)"
    >
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-300 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40 z-[0]" />
      </TransitionChild>

      <div
        class="fixed inset-0 sm:p-12"
        :class="[positionClass, size]"
      >
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-300 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            v-bind="$attrs"
            class="bg-emphasis/85 backdrop-blur-lg sm:rounded-default flex flex-col gap-4 h-full"
          >
            <button
              v-if="close"
              type="button"
              class="absolute top-0 right-0 rounded-md text-emphasis hover:text-default p-2 outline-none z-10"
              @click="closeModal(true)"
            >
              <span class="sr-only">Close</span>
              <div class="p-1 bg-emphasis/50 backdrop-blur-lg rounded-default">
                <PhX :size="24" />
              </div>
            </button>
            <DialogTitle
              v-if="$slots.title"
              as="h3"
              class="text-lg font-medium leading-6"
            >
              <div class="relative">
                <slot name="title" />
              </div>
            </DialogTitle>
            <DialogDescription v-if="$slots.description">
              <slot name="description" />
            </DialogDescription>
            <slot />
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped lang="postcss">
.giro__dialog {
  @apply p-6;
}
</style>
