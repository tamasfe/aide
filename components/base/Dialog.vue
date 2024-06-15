<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from "radix-vue";

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

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <DialogRoot v-model:open="opened">
    <DialogPortal>
      <DialogOverlay
        class="fixed top-0 left-0 right-0 bottom-0 bg-black/40 z-[13]"
      />
      <Transition name="giro__modal-fade">
        <DialogContent
          class="fixed top-0 left-0 right-0 bottom-0 rounded-default bg-emphasis/85 backdrop-blur-lg p-[32px] outline-none z-[100] sm:my-20"
          v-bind="$attrs"
          :class="[positionClass, size]"
        >
          <DialogTitle class="text-xl font-semibold pb-4">
            <slot name="title" />
          </DialogTitle>
          <DialogDescription>
            <slot name="description" />
          </DialogDescription>
          <slot />
          <DialogClose
            class="absolute top-[20px] right-[20px] inline-flex h-[25px] w-[25px] outline-none"
            aria-label="Close"
          >
            X
          </DialogClose>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.giro__modal-fade-enter-active {
  transition: all 150ms ease-in-out;
}

.giro__modal-fade-leave-active {
  transition: all 150ms ease-in-out;
}

.giro__modal-fade-enter-from,
.giro__modal-fade-leave-to {
  opacity: 0;
}

.giro__modal-fade-enter-to,
.giro__modal-fade-leave-from {
  opacity: 1;
}
</style>
