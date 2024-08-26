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

// NOTE there is the possibiility of this input being everything above
// except floating labels. This is important because it causes the entire
// input to no longer be "centered" in the middle, so things like dropcaps
// wont look good with floating labels.... how to best handle this i havent thought about
// but i suspect we need clever (non terrible/confusing) styling to account for both
// i am also thinking this mode activates if passing "placeholder" and then any label will be ignored

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

      <slot
        v-if="$slots.prefix"
        name="prefix"
      />

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
          class="absolute bottom-1 right-0 text-right text-sm whitespace-nowrap text-alert-error"
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
      class="text-right text-sm whitespace-nowrap text-alert-error"
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
</style>
