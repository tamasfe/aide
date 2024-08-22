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

const emit = defineEmits(["update:open"]);

// lg
// left

const props = defineProps<{
  open: boolean;
  position?: "left" | "right";
  size?: Size;
}>();

const open = computed({
  get: () => props.open,
  set: (value) => {
    emit("update:open", value);
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
    return MODAL_SIZES[props.size];
  }
  return "max-w-lg";
});

const closeModal = () => {
  open.value = false;
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
      :show="open"
      as="template"
    >
      <Dialog
        v-model:open="open"
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
