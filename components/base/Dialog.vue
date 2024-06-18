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

const emit = defineEmits(["update:opened"]);

const props = withDefaults(
  defineProps<{
    opened: boolean;
    center?: boolean;
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
    center: false,
    size: "lg",
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

        <div
          class="fixed inset-0 sm:p-12"
          :class="[positionClass, size]"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              v-bind="$attrs"
              class="bg-emphasis/85 backdrop-blur-lg rounded-default flex flex-col gap-4 h-full"
            >
              <button
                type="button"
                class="absolute top-0 right-0 rounded-md text-emphasis hover:text-default p-4"
                @click="closeModal"
              >
                <span class="sr-only">Close</span>
                <div
                  class="p-2 bg-emphasis/50 backdrop-blur-lg rounded-default"
                >
                  <PhX
                    :size="28"
                    class="relative z-[10]"
                  />
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
  </Teleport>
</template>

<style scoped lang="postcss">
.giro__dialog {
  @apply p-6;
}
</style>
