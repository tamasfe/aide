<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// ARCHITECTURE TODO:
// ✴️ anything using this component doesnt properly validate typescript which is bad

// TODO
// ✴️  floating label
// ✅ error (floating and below)
// ✴️  jiggle animation on error
// ✅ prefix/suffix
// ✴️  maska (use mask prop already on this component)

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<{
  fieldType?: "input" | "select";
  required?: boolean;
  placeholder?: string;
  placeholderPlacement?: "floating" | "default";
  errorPlacement?: "floating" | "below";
  mask?: string;
  class?: HTMLAttributes["class"];
}>(), {
  fieldType: "input",
  required: true,
  placeholderPlacement: "floating",
  errorPlacement: "floating",
});

const error = ref<string | undefined>();
setTimeout(() => {
  error.value = "This field is required";
}, 5000);

const fieldPlaceholder = computed(() => {
  if (props.placeholderPlacement === "floating") return undefined;
  return props.placeholder;
});

const fieldClass = computed(() => {
  if (props.placeholderPlacement === "floating") return "floating-field";
  return "default-field";
});
</script>

<template>
  <div class="flex flex-col gap-0.5">
    <div
      :class="cn(
        'flex flex-row px-5 relative h-[var(--giro-field-height)] rounded-default bg-subtle text-subtle',
        props.class,
      )"
    >
      <slot
        v-if="$slots.prefix"
        name="prefix"
      />

      <label
        v-if="placeholderPlacement === 'floating' && placeholder"
        class="floating-label"
      >
        <span>{{ placeholder }}</span>
        <span
          v-if="required"
          class="opacity-50 inline-block ml-[5px] mt-[1px] align-top leading-[1rem] text-lg text-alert-error"
        >*</span>
      </label>

      <div class="flex items-end w-full h-full relative">
        <BaseInput
          v-if="fieldType === 'input'"
          v-bind="$attrs"
          :required="required"
          :placeholder="fieldPlaceholder"
          variant="ghost"
          size="ghost"
          :class="fieldClass"
        />
        <BaseSelect
          v-else-if="fieldType === 'select'"
          v-bind="$attrs"
          :required="required"
          :placeholder="fieldPlaceholder"
          variant="ghost"
          size="ghost"
          :class="fieldClass"
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
.floating-label {
  @apply absolute left-5 top-1/2 -translate-y-1/2 font-medium;
}
.floating-field  {
  @apply w-full h-[var(--giro-input-group-hidden-field-height)] font-medium bg-transparent;
}
.default-field {
  @apply w-full h-full text-lg text-white font-medium placeholder:text-subtle bg-transparent;
}
.error {
  @apply text-right text-sm whitespace-nowrap text-alert-error;
}
</style>
