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
    "fixed inset-0 z-[10] w-full",
  ],
  {
    variants: {
      variant: {
        frosted: "bg-emphasis/85 backdrop-blur-lg",
      },
      size: {
        md: "p-5 sm:rounded-lg sm:w-[90vw] sm:max-w-[50rem] sm:min-h-[8rem] sm:max-h-[90vh] sm:self-center sm:justify-self-center",
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
    disabled?: boolean;
    variant?: DialogVariants["variant"];
    size?: DialogVariants["size"];
    closeOnClickOutside?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    disabled: false,
    closeOnClickOutside: true,
  },
);

const emit = defineEmits(["update:open", "close"]);

const open = computed({
  get: () => props.open,
  set: (value) => {
    emit("update:open", value);
  },
});

const onClose = (force: boolean) => {
  if (props.disabled) {
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
      @close="onClose(false)"
    >
      <TransitionChild
        as="template"
        v-bind="overlayTransition"
      >
        <div
          class="fixed inset-0 bg-black/40 z-[9]"
          aria-hidden="true"
        />
      </TransitionChild>

      <TransitionChild
        as="template"
        v-bind="panelTransition"
      >
        <DialogPanel
          v-bind="$attrs"
          :class="cn(
            dialogVariants({ variant, size }),
            props.class,
          )"
        >
          <BaseClose
            :disabled="disabled"
            @close="onClose(true)"
          />

          <slot />
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
