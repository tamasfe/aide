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
      'absolute top-0 right-0 p-4 text-subtle hover:text-emphasis z-[10] rounded-full transition-colors duration-200',
      props.class,
    )"
    @click="$emit('close')"
  >
    <span class="sr-only">{{ $t('i18n.close') }}</span>
    <div class="rounded-full bg-subtle/80 backdrop-blur p-1">
      <BaseIcon
        name="lucide:x"
        :size="20"
      />
    </div>
  </BaseButton>
</template>
