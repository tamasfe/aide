<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// ARCHITECTURE TODO:
// ✴️ anything using this component doesnt properly validate typescript which is bad

// TODO
// ✴️  floating label
// ✴️  error (right aligned under input)
// ✴️  jiggle animation on error
// ✴️  prefix/suffix
// ✴️  maska (use mask prop already on this component)

// NOTE this component needs to be refactored to support NON floating labels if placeholder="" is passed.
// im unsure the best way to do this to minimize styling spaghetti... im almost slightly
// tempted to rebuild the entire component except below... but much simpler ... but i will
// just defer doing that yet. in the non floating version, the text always sits right in
// the middle

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<{
  fieldType: "input" | "select";
  errorPlacement: "floating" | "below";
  required?: boolean;
  mask?: string;
  label?: string;
  class?: HTMLAttributes["class"];
}>(), {
  fieldType: "input",
  errorPlacement: "floating",
  required: true,
});

const error = ref<string | undefined>();
setTimeout(() => {
  error.value = "This field is required";
}, 5000);
</script>

<template>
  <div class="flex flex-col gap-0.5">
    <div
      :class="cn(
        'flex flex-row justify-center items-end px-5 relative h-[var(--giro-field-height)] rounded-default bg-subtle text-subtle',
        props.class,
      )"
    >
      <slot
        v-if="$slots.prefix"
        name="prefix"
      />

      <label
        v-if="label"
        class="label"
      >
        <span>{{ props.label }}</span>
        <span
          v-if="required"
          class="opacity-50 inline-block ml-[5px] mt-[1px] align-top leading-[1rem] text-lg text-alert-error"
        >*</span>
      </label>

      <div class="w-full relative">
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
          v-if="errorPlacement === 'floating' && error"
          class="error absolute bottom-1 right-0"
        >
          {{ error }}
        </div>
      </div>

      <slot
        v-if="$slots.suffix"
        name="suffix"
      />
    </div>

    <div
      v-if="errorPlacement === 'below' && error"
      class="error"
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
  @apply h-[var(--giro-input-group-hidden-field-height)] w-full font-medium bg-transparent;
}
.error {
  @apply text-right text-sm whitespace-nowrap text-alert-error;
}
</style>
