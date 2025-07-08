<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "vue";

const buttonVariants = cva(
  "aspect-square h-full text-subtle hover:text-emphasis z-[10] rounded-lg transition-colors duration-200",
  {
    variants: {
      size: {
        sm: "p-2",
        md: "p-3",
        lg: "p-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

const props = withDefaults(defineProps<{
  disabled?: boolean;
  class?: HTMLAttributes["class"];
  size?: ButtonVariants["size"];
}>(), {
  disabled: false,
});

defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <BaseButton
    variant="ghost"
    size="ghost"
    :disabled="disabled"
    :class="cn(
      buttonVariants({ size }),
      props.class,
    )"
    @click="$emit('close')"
  >
    <span class="sr-only">{{ $t('i18n.close') }}</span>
    <div class="aspect-square bg-subtle/80 rounded backdrop-blur h-full flex items-center justify-center">
      <BaseIcon
        name="lucide:x"
        :size="20"
      />
    </div>
  </BaseButton>
</template>
