<script setup lang="ts">
import { computed } from "vue";
import type { HTMLAttributes } from "vue";
import { cva, type VariantProps } from "class-variance-authority";
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
} from "reka-ui";

// DESIGN STATUS:       ✴️
//   * overlay + panel now animate properly (enter+leave) via Vue <Transition>
// ARCHITECTURE STATUS: ✅ (no Headless UI; portal to <body>; controlled v-model)
// TRANSLATION STATUS:  ✅ (typo-proofed transitions)

const drawerVariants = cva(
  "z-20 fixed inset-0 sm:w-[300px] min-h-0",
  {
    variants: {
      position: {
        left: "sm:right-auto",
        right: "sm:left-auto",
      },
    },
    defaultVariants: {
      position: "left",
    },
  },
);
type DrawerVariants = VariantProps<typeof drawerVariants>;

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    open: boolean;
    position?: DrawerVariants["position"];
    class?: HTMLAttributes["class"];
  }>(),
  { position: "left" },
);

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
}>();

const open = computed({
  get: () => props.open,
  set: (value: boolean) => emit("update:open", value),
});

const onClose = () => {
  open.value = false;
};
</script>

<template>
  <DialogRoot v-model:open="open" :modal="true">
    <DialogPortal>
      <Transition name="overlay-fade" appear>
        <DialogOverlay
          class="fixed inset-0 z-20 sm:bg-black/40 sm:backdrop-blur-sm"
        >
          <Transition :name="props.position === 'left' ? 'drawer-left' : 'drawer-right'" appear>
            <DialogContent
              v-bind="$attrs"
              :class="cn(
                drawerVariants({ position: props.position }),
                'bg-emphasis flex flex-col gap-4',
                props.class,
              )"
            >
              <slot :close="onClose" />
            </DialogContent>
          </Transition>
        </DialogOverlay>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<style>
/* Overlay fade */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity .35s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* Drawer: left */
.drawer-left-enter-active,
.drawer-left-leave-active {
  transition: transform .15s ease, opacity .15s ease;
}
.drawer-left-enter-from,
.drawer-left-leave-to {
  transform: translateX(-100%);
}

/* Drawer: right */
.drawer-right-enter-active,
.drawer-right-leave-active {
  transition: transform .15s ease, opacity .15s ease;
}
.drawer-right-enter-from,
.drawer-right-leave-to {
  transform: translateX(100%);
}
</style>
