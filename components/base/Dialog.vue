<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/utils";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * i dont think the "leave" animations are working properly. i dont WANT animation on close (i like instant) but the component should work still properly
//   * make sure we are doing everything top notch according to docs.. i notice some components are not structured like the examples https://headlessui.com/v1/vue/dialog
//   * TODO: make sure "close" is actually emitted by headliess UI so we arent emitting things we dont 100% expect to be true
//   * TODO: make teleport to body work
// TRANSLATION STATUS:  ✅

// todo "size" is hardcoded to max-w-lg.. either put back as prop or delete

const dialogVariants = cva(
  [
    "fixed inset-0 z-[10]",
    "md:max-w-[32rem]",
    // "mx-auto min-h-0 max-h-[90vh] self-center",
  ],
  {
    variants: {
      variant: {
        default: "bg-emphasis/85 backdrop-blur-lg sm:rounded-default",
      },
    },
    defaultVariants: {
      variant: "default",
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
    variant?: DialogVariants["variant"];
    closeOnClickOutside?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
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

const onClose = (isManuallyTriggered: boolean) => {
  if (props.closeOnClickOutside || isManuallyTriggered) {
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
            dialogVariants({ variant }),
            props.class,
          )"
        >
          <BaseClose
            @close="onClose(true)"
          />

          <slot />
        </DialogPanel>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>
</template>
