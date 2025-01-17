<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = withDefaults(defineProps<{
  disabled?: boolean;
  class?: HTMLAttributes["class"];
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
      'aspect-square p-3 h-full text-subtle hover:text-emphasis z-[10] rounded-lg transition-colors duration-200',
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
