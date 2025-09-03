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

const dialogVariants = cva(
  ["z-20 h-full sm:h-auto absolute sm:block inset-0 sm:inset-auto sm:max-h-[calc(100vh-2rem)] overflow-y-scroll no-scrollbar outline outline-emphasis/50 relative"],
  {
    variants: {
      variant: { default: "bg-emphasis" },
      size: {
        md: "p-5 w-full sm:max-w-[var(--giro-modal-default-max-width)] sm:rounded-lg",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);

type DialogVariants = VariantProps<typeof dialogVariants>;

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    open: boolean;
    disabled?: boolean;
    variant?: DialogVariants["variant"];
    size?: DialogVariants["size"];
    closeOnClickOutside?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  { disabled: false, closeOnClickOutside: true },
);

const emit = defineEmits<{ (e: "update:open", value: boolean): void }>();

const open = computed({
  get: () => props.open,
  set: (v: boolean) => emit("update:open", v),
});

const onClose = (force = false) => {
  if (props.disabled) return;
  if (props.closeOnClickOutside || force) open.value = false;
};
</script>

<template>
  <DialogRoot v-model:open="open" :modal="true">
    <DialogPortal>
      <Transition name="overlay-fade" appear>
        <DialogOverlay
          class="fixed inset-0 z-20 sm:bg-black/40 sm:backdrop-blur-sm flex items-center justify-center sm:p-6"
        >
          <Transition name="content-pop" appear>
            <DialogContent
              :class="cn(dialogVariants({ variant, size }), props.class)"
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
/* Overlay fade in/out */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity .18s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* Content scale+fade in/out */
.content-pop-enter-active,
.content-pop-leave-active {
  transition:
    opacity .20s cubic-bezier(.16,1,.3,1),
    transform .20s cubic-bezier(.16,1,.3,1);
}
.content-pop-enter-from,
.content-pop-leave-to {
  opacity: 0;
  transform: translateY(-6rem) scale(0.98);
}
</style>
