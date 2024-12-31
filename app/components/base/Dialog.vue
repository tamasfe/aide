<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * refactor out the 'frosted' background to tailwind so our drawer (and anywhere else its used) can also use it
//   * i dont think the "leave" animations are working properly. i dont WANT animation on close (i like instant) but the component should work still properly
//   * make sure we are doing everything top notch according to docs.. i notice some components are not structured like the examples https://headlessui.com/v1/vue/dialog
//   * TODO: make sure "close" is actually emitted by headliess UI so we arent emitting things we dont 100% expect to be true
//   * TODO: make teleport to body work
// TRANSLATION STATUS:  ✅

const dialogVariants = cva(
  [
    "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10] overflow-y-scroll no-scrollbar outline outline-emphasis/50",
  ],
  {
    variants: {
      variant: {
        frosted: "bg-emphasis/85 backdrop-blur-2xl",
      },
      size: {
        md: "p-5 w-full h-full sm:max-w-[var(--giro-modal-default-max-width)] sm:h-auto sm:max-h-[95vh] sm:rounded-lg",
      },
    },
    defaultVariants: {
      variant: "frosted",
      size: "md",
    },
  },
);

type DialogVariants = VariantProps<typeof dialogVariants>;

const overlayTransition = ref({
  enter: "duration-150 ease-out",
  enterFrom: "opacity-0",
  enterTo: "opacity-100",
  leave: "duration-150 ease-in",
  leaveFrom: "opacity-100",
  leaveTo: "opacity-0",
});

const panelTransition = ref({
  enter: "duration-150 ease-out",
  enterFrom: "opacity-0 scale-95",
  enterTo: "opacity-100 scale-100",
  leave: "duration-150 ease-in",
  leaveFrom: "opacity-100 scale-100",
  leaveTo: "opacity-0 scale-95",
});

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    open: boolean;
    unclosable?: boolean;
    disabled?: boolean;
    variant?: DialogVariants["variant"];
    size?: DialogVariants["size"];
    closeOnClickOutside?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    unclosable: false,
    disabled: false,
    closeOnClickOutside: true,
  },
);

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "close"): void;
}>();

const open = computed({
  get: () => props.open,
  set: (value) => {
    emit("update:open", value);
  },
});

const onClose = (force: boolean) => {
  if (props.disabled || props.unclosable) {
    return;
  }
  if (props.closeOnClickOutside || force) {
    open.value = false;
    emit("close");
  }
};
</script>

<template>
  <TransitionRoot
    appear
    :show="open"
    as="template"
  >
    <Dialog
      v-model:open="open"
      as="div"
      class="relative z-[10]"
      @close="onClose(false)"
    >
      <TransitionChild
        as="template"
        v-bind="overlayTransition"
      >
        <BaseOverlay />
      </TransitionChild>

      <TransitionChild
        as="template"
        v-bind="panelTransition"
      >
        <DialogPanel
          v-bind="$attrs"
          :class="cn(dialogVariants({ variant, size }), props.class)"
        >
          <BaseClose
            v-if="!unclosable"
            :disabled="disabled"
            @close="onClose(true)"
          />

          <slot />
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
