<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";

const emit = defineEmits(["update:opened"]);

const props = withDefaults(
  defineProps<{
    opened: boolean;
    position?: "left" | "right";
    size?:
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

const size = computed(() => {
  if (props.size) {
    switch (props.size) {
      case "full":
        return "max-w-full";
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      case "2xl":
        return "max-w-2xl";
      case "3xl":
        return "max-w-3xl";
      case "4xl":
        return "max-w-4xl";
      case "5xl":
        return "max-w-5xl";
      case "6xl":
        return "max-w-6xl";
      case "7xl":
        return "max-w-7xl";
      case "8xl":
        return "max-w-8xl";
      case "9xl":
        return "max-w-9xl";
      case "10xl":
        return "max-w-10xl";
    }
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
        class="relative z-10"
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
              class="bg-emphasis/85 backdrop-blur-lg rounded-default p-6 flex flex-col gap-4 h-full"
              v-bind="$attrs"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6"
              >
                <div class="relative">
                  <slot name="title" />
                  <button
                    type="button"
                    class="absolute top-0 right-0 rounded-md text-emphasis hover:text-default"
                    @click="closeModal"
                  >
                    <span class="sr-only">Close</span>
                    <span class="text-2xl">X</span>
                  </button>
                </div>
              </DialogTitle>
              <DialogDescription>
                <slot name="description" />
              </DialogDescription>
              <slot>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Your payment has been successfully submitted. We’ve sent you
                    an email with all of the details of your order.
                  </p>
                </div>
                <div class="mt-4">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    @click="closeModal"
                  >
                    Got it, thanks!
                  </button>
                </div>
              </slot>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </Teleport>
</template>
