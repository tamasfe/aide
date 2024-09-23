<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// DESIGN TODO:
// ✴️  this component doesnt handle other variants, but the hard thing about that is CVA() doesnt let you do multiple classes for a SINGLE variant i think. so we might need to use computed properties to build other things like (input size, icon size etc). we can also do them as props like inputClass, iconClass, etc... but i usually find that very nasty
// ARCHITECTURE TODO:
// ✴️ anything using this component doesnt properly validate typescript which is bad

// TODO
// ✴️  floating label
// ✅ error (floating and below)
// ✴️  jiggle animation on error
// ✅ prefix/suffix
// ✅ maska (use mask prop already on this component)

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    fieldType?: "input" | "select";
    required?: boolean;
    placeholder?: string;
    placeholderPlacement?: "floating" | "default";
    errorPlacement?: "floating" | "below";
    errorMessage?: string;
    mask?: string;
    class?: HTMLAttributes["class"];
    value?: unknown;
  }>(),
  {
    fieldType: "input",
    required: true,
    placeholderPlacement: "floating",
    errorPlacement: "floating",
  },
);

const inputGroupContainer = ref<HTMLElement | null>(null);
const floatingLabel = ref<HTMLElement | null>(null);

const fieldPlaceholder = computed(() => {
  if (props.placeholderPlacement === "floating") return undefined;
  return props.placeholder;
});

const fieldClass = computed(() => {
  if (props.placeholderPlacement === "floating") return "floating-field";
  return "default-field";
});

defineEmits<{
  input: [value: string];
}>();

const onFloatFocus = () => {
  floatingLabel.value?.classList.add("focused");
};

const onFloatBlur = () => {
  floatingLabel.value?.classList.remove("focused");
};

const setupFloatingLabel = () => {
  if (props.placeholderPlacement !== "floating") return;
  const input = inputGroupContainer.value?.querySelector("input");
  if (input) {
    input.addEventListener("focus", onFloatFocus);
    input.addEventListener("blur", onFloatBlur);
  }
};

const destroyFloatingLabel = () => {
  if (props.placeholderPlacement !== "floating") return;
  const input = inputGroupContainer.value?.querySelector("input");
  if (input) {
    input.removeEventListener("focus", onFloatFocus);
    input.removeEventListener("blur", onFloatBlur);
  }
};

onMounted(() => {
  setupFloatingLabel();
});

onBeforeUnmount(() => {
  destroyFloatingLabel();
});
</script>

<template>
  <div class="w-full flex flex-col gap-0.5">
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
        ref="floatingLabel"
        class="floating-label pointer-events-none"
        :class="{ 'giro__input-has-value': !!props.value }"
      >
        <span>{{ placeholder }}</span>
        <span
          v-if="required"
          class="opacity-50 inline-block ml-[5px] mt-[1px] align-top leading-[1rem] text-lg text-alert-error"
        >*</span>
      </label>

      <div
        ref="inputGroupContainer"
        class="giro__input-group-container flex items-end w-full h-full relative"
      >
        <BaseInput
          v-if="fieldType === 'input'"
          :mask-pattern="mask"
          v-bind="$attrs"
          :required="required"
          :placeholder="fieldPlaceholder"
          variant="ghost"
          size="ghost"
          :class="cn(
            fieldClass,
            'text-emphasis',
          )"
          @input="(event) => $emit('input', event)"
        />
        <BaseSelect
          v-else-if="fieldType === 'select'"
          v-bind="$attrs"
          :required="required"
          :placeholder="fieldPlaceholder"
          :class="fieldClass"
          @input="(event) => $emit('input', event)"
        />

        <div
          v-if="errorPlacement === 'floating' && errorMessage"
          class="error absolute bottom-1 right-0"
        >
          {{ errorMessage }}
        </div>
      </div>

      <slot
        v-if="$slots.suffix"
        name="suffix"
      />
    </div>

    <div
      v-if="errorPlacement === 'below' && errorMessage"
      class="error"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.floating-label {
  @apply absolute left-5 top-1/2 -translate-y-1/2 font-medium;
  transition: transform 0.20s cubic-bezier(0.25, 0, 0.25, 1);
  transform-origin: 0 0;
}
.floating-label.focused,
.floating-label.giro__input-has-value {
  transform: scale(0.9) translateY(-100%);
}
.floating-field {
  @apply w-full h-[var(--giro-input-group-hidden-field-height)] font-medium bg-transparent;
}
.default-field {
  @apply w-full h-full text-lg text-white font-medium placeholder:text-subtle bg-transparent;
}
.error {
  @apply text-right text-sm whitespace-nowrap text-alert-error;
}
</style>
