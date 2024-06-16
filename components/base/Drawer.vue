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
    position: "left" | "right";
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

const animationName = computed(() => {
  if (props.position === "left") {
    return "giro__modal-slide-left";
  }
  return "giro__modal-slide-right";
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
      <Transition :name="animationName">
        <DialogContent
          class="bg-emphasis/85 backdrop-blur-lg p-[32px] outline-none z-[100]"
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
.giro__modal-slide-right-enter-active,
.giro__modal-slide-left-enter-active {
  transition: all 150ms ease-in-out;
}

.giro__modal-slide-right-leave-active,
.giro__modal-slide-left-leave-active {
  transition: all 150ms ease-in-out;
}

.giro__modal-slide-right-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.giro__modal-slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.giro__modal-slide-left-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.giro__modal-slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
