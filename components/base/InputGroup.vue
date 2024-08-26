<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// ARCHITECTURE TODO:
// ✴️ anything using this component doesnt properly validate typescript which is bad

// TODO
// ✴️  floating label
// ✴️  error (right aligned under input)
// ✴️  jiggle animation on error
// ✴️  font/end dropcaps
// ✴️  maska (use mask prop already on this component)

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<{
  fieldType: "input" | "select";
  required?: boolean;
  mask?: string;
  label?: string;
  class?: HTMLAttributes["class"];
}>(), {
  fieldType: "input",
  required: true,
});

const error = ref("this is an error");
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
    >
      <span>{{ props.label }}</span>
      <span
        v-if="required"
        class="inline-block ml-[5px] mt-[1px] align-top leading-[1rem] text-lg text-alert-error"
      >*</span>
    </label>

    <BaseInput
      v-if="fieldType === 'input'"
      v-bind="$attrs"
      :required="required"
      variant="ghost"
      size="ghost"
      class="field"
    />
    <BaseSelect
      v-else-if="fieldType === 'select'"
      v-bind="$attrs"
      :required="required"
      variant="ghost"
      size="ghost"
      class="field"
    />

    <div
      v-if="error"
      class="absolute bottom-1 right-2 text-right text-sm whitespace-nowrap text-alert-error"
    >
      {{ error }}
    </div>
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
