<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";

// DESIGN STATUS:       ✴️
//   * are translations actually working? there was a typo in the original code so we should test to make sure its actually correct. i see it animated but it might be sub-optimal
//   * also check the animation for the overlay, it appears instantly, i may have broken it
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const drawerVariants = cva(
  "fixed top-0 bottom-0 h-full w-full sm:w-auto min-h-0",
  {
    variants: {
      position: {
        left: "left-0",
        right: "right-0",
      },
    },
  },
);

type DrawerVariants = VariantProps<typeof drawerVariants>;

const positionTransitions = computed(() => ({
  left: {
    enter: "duration-150 ease-out",
    enterFrom: "transform -translate-x-full",
    enterTo: "transform translate-x-0",
    leave: "duration-150 ease-in",
    leaveFrom: "transform translate-x-0",
    leaveTo: "transform -translate-x-full",
  },
  right: {
    enter: "duration-150 ease-out",
    enterFrom: "transform translate-x-full",
    enterTo: "transform translate-x-0",
    leave: "duration-150 ease-in",
    leaveFrom: "transform translate-x-0",
    leaveTo: "transform translate-x-full",
  },
}));

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<{
  open: boolean;
  position?: DrawerVariants["position"];
  class?: HTMLAttributes["class"];
}>(), {
  position: "left",
});

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const positionTransition = computed(() => {
  const position = props.position as keyof typeof positionTransitions.value;
  return positionTransitions.value[position];
});

const onClose = () => {
  open.value = false;
};

const open = computed({
  get: () => props.open,
  set: (value) => {
    emit("update:open", value);
  },
});
</script>

<template>
  <Teleport to="body">
    <TransitionRoot
      appear
      :show="open"
      as="template"
    >
      <Dialog
        v-model:open="open"
        as="div"
        class="relative z-[9]"
        @close="onClose"
      >
        <TransitionChild
          as="template"
          enter="duration-350 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-350 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <BaseOverlay />
        </TransitionChild>

        <div
          :class="cn(
            drawerVariants({ position }),
            props.class,
          )"
        >
          <TransitionChild
            as="template"
            v-bind="positionTransition"
          >
            <DialogPanel
              class="bg-emphasis/85 backdrop-blur-2xl p-5 flex flex-col gap-4 h-full"
              v-bind="$attrs"
            >
              <BaseClose
                class="top-2 right-2"
                @close="onClose"
              />

              <DialogTitle as="h3">
                <slot name="title" />
              </DialogTitle>

              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </Teleport>
</template>
