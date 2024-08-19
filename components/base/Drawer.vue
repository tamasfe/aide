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

const emit = defineEmits(["update:opened"]);

const props = withDefaults(
  defineProps<{
    opened: boolean;
    position?: "left" | "right";
    size?: Size;
  }>(),
  {
    size: "lg",
    position: "left",
  },
);

const opened = computed({
  get: () => props.opened,
  set: (value) => {
    emit("update:opened", value);
  },
});

const positionClass = computed(() => {
  if (props.position === "left") {
    return "fixed left-0 top-0 bottom-0 h-full min-h-0";
  }
  return "fixed right-0 top-0 bottom-0 h-full min-h-0 ";
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

const closeModal = () => {
  opened.value = false;
};

defineOptions({
  inheritAttrs: false,
});

const slideTransition = computed(() => ({
  enter: `duration-150 ease-out`,
  enterFrom:
    props.position === "left"
      ? "transform -translate-x-full"
      : "transform translate-x-full",
  etnerTo:
    props.position === "left"
      ? "transform translate-x-0"
      : "transform translate-x-0",
  leave: `duration-150 ease-in`,
  leaveFrom:
    props.position === "left"
      ? "transform translate-x-0"
      : "transform translate-x-0",
  leaveTo:
    props.position === "left"
      ? "transform -translate-x-full"
      : "transform translate-x-full",
}));
</script>

<template>
  <Teleport to="body">
    <TransitionRoot
      appear
      :show="opened"
      as="template"
    >
      <Dialog
        v-model:open="opened"
        as="div"
        class="relative z-[9]"
        @close="closeModal"
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
          <div class="fixed inset-0 bg-black/40 z-[0]" />
        </TransitionChild>

        <div :class="[positionClass, size]">
          <TransitionChild
            as="template"
            v-bind="slideTransition"
          >
            <DialogPanel
              class="bg-emphasis/85 backdrop-blur-lg rounded-default p-4 flex flex-col gap-4 h-full"
              v-bind="$attrs"
            >
              <button
                type="button"
                class="absolute top-0 right-0 rounded-md text-subtle hover:text-emphasis py-4 px-2 outline-none z-10"
                @click="closeModal"
              >
                <span class="sr-only">Close</span>
                <div
                  class="p-1 bg-emphasis/50 backdrop-blur-lg rounded-default"
                >
                  <PhX :size="24" />
                </div>
              </button>
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6"
              >
                <div class="relative">
                  <slot name="title" />
                </div>
              </DialogTitle>
              <DialogDescription>
                <slot name="description" />
              </DialogDescription>
              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </Teleport>
</template>
