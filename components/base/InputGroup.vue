<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// TODO
// * floating label
// * error (right aligned under input)
// * jiggle animation on error
// * font/end dropcaps
// * maska

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<{
  fieldType: "input" | "select";
  label?: string;
  class?: HTMLAttributes["class"];
}>(), {
  fieldType: "input",
});
</script>

<template>
  <div
    :class="cn(
      'flex flex-row relative h-[var(--giro-field-height)] rounded-default bg-subtle text-subtle',
      props.class,
    )"
  >
    <label
      v-if="label"
      class="label"
    >{{ props.label }}</label>

    <BaseInput
      v-if="fieldType === 'input'"
      v-bind="$attrs"
      variant="ghost"
      size="ghost"
      class="field"
    />
    <BaseSelect
      v-else-if="fieldType === 'select'"
      v-bind="$attrs"
      variant="ghost"
      size="ghost"
      class="field"
    />
  </div>
</template>

<style scoped>
.label {
  @apply absolute left-5 top-1/2 -translate-y-1/2;
}
.field  {
  @apply h-[var(--giro-input-group-hidden-field-height)] mx-5 w-full font-medium self-end bg-transparent;
}
</style>
