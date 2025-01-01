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
      'absolute top-0 right-0 p-4 text-subtle hover:text-emphasis z-[10] rounded-full',
      props.class,
    )"
    @click="$emit('close')"
  >
    <span class="sr-only">{{ $t('i18n.close') }}</span>
    <BaseIcon
      name="lucide:x"
      :size="22"
    />
  </BaseButton>
</template>
