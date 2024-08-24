<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "~/utils";

const { t } = useI18n();

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();

defineEmits(["close"]);
</script>

<template>
  <BaseButtonNew
    variant="ghost"
    size="ghost"
    :class="cn(
      'absolute top-2 right-2 p-3 text-subtle hover:text-emphasis z-[10]',
      props.class,
    )"
    @click="$emit('close')"
  >
    <span class="sr-only">{{ t('i18n.close') }}</span>
    <Icon
      name="lucide:x"
      size="24"
    />
  </BaseButtonNew>
</template>
