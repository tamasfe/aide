<script lang="ts" setup>
import { IconsX as X } from "#components";

const props = defineProps<{
  opened: boolean;
  slideOutLeft?: boolean;
  slideOutRight?: boolean;
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
}>();

const emit = defineEmits(["update:opened"]);

const { opened } = toRefs(props);

const animationName = computed(() => {
  if (props.slideOutLeft) {
    return "robust-ui-modal__slide-left";
  }
  if (props.slideOutRight) {
    return "robust-ui-modal__slide-right";
  }

  return "robust-ui-modal__fade";
});

const positionClass = computed(() => {
  if (props.slideOutLeft) {
    return "absolute left-0 top-0 bottom-0 h-full min-h-0";
  } else if (props.slideOutRight) {
    return "absolute right-0 top-0 bottom-0 h-full min-h-0 ";
  } else if (props.center) {
    return "mx-auto min-h-0 self-center";
  } else {
    return "mx-auto h-full min-h-0";
  }
});

const close = () => {
  opened.value = false;
  emit("update:opened", false);
};

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
</script>

<template>
  <Teleport to="body">
    <Transition :name="animationName">
      <div
        v-show="opened"
        ref="root"
        class="fixed top-0 bottom-0 left-0 right-0 z-[100] sm:p-12 flex"
        role="dialog"
      >
        <div
          class="absolute top-0 left-0 right-0 bottom-0 bg-black/40 z-[-1]"
          @click.self="close"
        ></div>
        <div
          class="giro__modal-box bg-subtle text-emphasis rounded-default p-[32px] flex flex-col gap-y-4"
          :class="[positionClass, size]"
          @click.stop
        >
          <div class="flex items-center justify-between">
            <div>
              <slot name="prefix" />
            </div>
            <div class="text-xl">
              <slot name="title" />
            </div>
            <slot name="suffix">
              <div class="cursor-pointer" @click="close">
                <X :size="32" />
              </div>
            </slot>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="postcss" scoped>
.giro__modal-fade-enter-active {
  transition: all 150ms ease-in-out;

  .giro__modal-backdrop {
    transition: all 150ms ease-in-out;
  }

  .giro__modal-box {
    transition: all 150ms ease-in-out;
  }
}

.giro__modal-fade-leave-active {
  transition: all 100ms ease-in-out;

  .giro__modal-backdrop {
    transition: all 100ms ease-in-out;
  }

  .giro__modal-box {
    transition: all 100ms ease-in-out;
  }
}

.giro__modal-fade-enter-from {
  .giro__modal-backdrop {
    opacity: 0;
  }

  .giro__modal-box {
    transform: translateY(-10px);
    opacity: 0;
  }
}

.giro__modal-fade-leave-to {
  .giro__modal-backdrop {
    opacity: 0;
  }

  .giro__modal-box {
    transform: translateY(10px);
    opacity: 0;
  }
}

.giro__modal-slide-right-enter-active,
.giro__modal-slide-left-enter-active {
  transition: all 150ms ease-in-out;

  .giro__modal-backdrop {
    transition: all 150ms ease-in-out;
  }

  .giro__modal-box {
    transition: all 150ms ease-in-out;
  }
}

.giro__modal-slide-right-leave-active,
.giro__modal-slide-left-leave-active {
  transition: all 150ms ease-in-out;

  .giro__modal-backdrop {
    transition: all 150ms ease-in-out;
  }

  .giro__modal-box {
    transition: all 150ms ease-in-out;
  }
}

.giro__modal-slide-right-enter-from {
  .giro__modal-backdrop {
    opacity: 0;
  }

  .giro__modal-box {
    transform: translateX(100%);
    opacity: 0;
  }
}

.giro__modal-slide-right-leave-to {
  .giro__modal-backdrop {
    opacity: 0;
  }

  .giro__modal-box {
    transform: translateX(100%);
    opacity: 0;
  }
}

.giro__modal-slide-left-enter-from {
  .giro__modal-backdrop {
    opacity: 0;
  }

  .giro__modal-box {
    transform: translateX(-100%);
    opacity: 0;
  }
}

.giro__modal-slide-left-leave-to {
  .giro__modal-backdrop {
    opacity: 0;
  }

  .giro__modal-box {
    transform: translateX(-100%);
    opacity: 0;
  }
}
</style>
