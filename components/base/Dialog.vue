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

const emit = defineEmits(["update:open", "close"]);

type Size = keyof typeof MODAL_SIZES;

const props = withDefaults(
  defineProps<{
    open: boolean;
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

const open = computed({
  get: () => props.open,
  set: (value) => {
    emit("update:open", value);
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

const size = computed(() => {
  if (props.size) {
    return MODAL_SIZES[props.size];
  }
  return "max-w-lg";
});

const closeModal = (isManuallyTriggered: boolean) => {
  if (props.closeOnClickOutside || isManuallyTriggered) {
    open.value = false;
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
    :show="open"
    as="template"
  >
    <Dialog
      v-model:open="open"
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
