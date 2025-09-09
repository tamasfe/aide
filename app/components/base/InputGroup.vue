<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { MaskInputOptions } from "maska";
import { UserTelephoneMask } from "~/modules/users/infra/ui/UserTelephoneMask";
import { useRegisterFormErrorIsPulsing } from "~/components/form/register/formErrorPulse";

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
    id?: string;
    fieldType?: "input" | "textarea";
    required?: boolean;
    placeholder?: string;
    placeholderPlacement?: "floating" | "default";
    errorPlacement?: "floating" | "below";
    errorMessage?: string;
    mask?: { type: "cpf" } | { type: "money" } | { type: "telephone"; countryCode: string; telephone: string };
    maskBehaviourEager?: boolean;
    class?: HTMLAttributes["class"];
    inputSize?: "ghost" | "md" | "lg";
  }>(),
  {
    fieldType: "input",
    required: true,
    placeholderPlacement: "floating",
    errorPlacement: "floating",
    inputSize: "ghost",
  },
);

const mask: ComputedRef<undefined | string | MaskInputOptions> = computed(() => {
  if (!props.mask) return undefined;

  switch (props.mask.type) {
    case "cpf":
      return "###.###.###-##";
    case "money":
      return {
        mask: "0.99",
        tokens: {
          0: {
            pattern: /\d/,
            multiple: true,
          },
          9: {
            pattern: /\d/,
            optional: true,
          },
        },
      };

    case "telephone":
      return UserTelephoneMask.new(props.mask.countryCode, props.mask.telephone).value();
  }

  return undefined;
});

const inputGroupContainer = ref<HTMLElement | null>(null);
const floatingLabel = ref<HTMLElement | null>(null);
const isInputFocused = ref(false);
const id = computed(() => props.id ?? `giro-input-group-${useId()}`);

const fieldPlaceholder = computed(() => {
  if (props.placeholderPlacement === "floating") return undefined;
  return props.placeholder;
});

const fieldClass = computed(() => {
  if (props.placeholderPlacement === "floating") return "floating-field";
  return "default-field";
});

const emits = defineEmits<{
  input: [value: string];
  change: [value: string];
}>();

const onFloatFocus = () => {
  isInputFocused.value = true;
};

const onFloatBlur = () => {
  isInputFocused.value = false;
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

const [value, modifiers] = defineModel<number | string>({
  set(value) {
    if (modifiers.number) {
      return Number(value);
    }
    return value;
  },
});

// Emphasize current field's error when a parent form pulses errors
// TODO: if we like the idea and animation: re-work it so only the register form BaseInputGroup pulses are triggered
const errorIsPulsing = useRegisterFormErrorIsPulsing();
</script>

<template>
  <div class="w-full flex flex-col gap-0.5">
    <div
      :class="cn(
        'flex flex-row px-5 relative h-[var(--giro-field-height)] rounded bg-subtle text-subtle transition-all duration-700',
        props.class,
        {
          'bg-alert-error': props.errorMessage && errorIsPulsing,
        },
      )"
    >
      <slot
        v-if="$slots.prefix"
        name="prefix"
      />

      <label
        v-if="placeholderPlacement === 'floating' && placeholder"
        ref="floatingLabel"
        :for="id"
        class="floating-label pointer-events-none"
        :class="{
          'giro__input-has-value': !!value,
          'focused': isInputFocused,
        }"
      >
        <span>{{ placeholder }}</span>
        <span
          v-if="required"
          class="opacity-50 inline-block ml-[5px] mt-[1px] align-top leading-[1rem] text-lg text-alert-error"
        >*</span>
      </label>

      <div
        ref="inputGroupContainer"
        class="giro__input-group-container flex-1 flex items-end h-full relative"
      >
        <BaseInput
          v-if="fieldType === 'input'"
          :id="id"
          v-model="value"
          :mask="mask"
          :mask-behaviour-eager="maskBehaviourEager"
          v-bind="$attrs"
          :required="required"
          :placeholder="fieldPlaceholder"
          variant="ghost"
          :input-size="inputSize"
          autocorrect="off"
          :aria-describedby="`error-${id}`"
          :class="cn(
            fieldClass,
            value !== '' && value !== undefined ? 'h-[var(--giro-input-group-hidden-field-height)]' : 'h-full',
            'text-emphasis focus:h-full',
          )"
          @input="event => emits('input', (event.target as HTMLInputElement)?.value ?? '')"
          @change="event => emits('change', (event.target as HTMLInputElement)?.value ?? '')"
        />
        <BaseTextarea
          v-else-if="fieldType === 'textarea'"
          :id="id"
          v-model="value"
          :mask="mask"
          :mask-behaviour-eager="maskBehaviourEager"
          v-bind="$attrs"
          :required="required"
          :placeholder="fieldPlaceholder"
          variant="ghost"
          :input-size="inputSize"
          :aria-describedby="`error-${id}`"
          autocorrect="off"
          :class="cn(
            fieldClass,
            value !== '' && value !== undefined ? 'h-[var(--giro-input-group-hidden-field-height)]' : 'h-full',
            'text-emphasis focus:h-full',
          )"
          @input="(event) => emits('input', event)"
          @change="(event) => emits('change', event)"
        />

        <div
          v-if="errorPlacement === 'floating' && errorMessage"
          :id="`error-${id}`"
          class="px-1 error absolute bottom-1 right-0 bg-inherit pointer-events-none"
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
      :id="`error-${id}`"
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
  @apply w-full focus:h-[var(--giro-input-group-hidden-field-height)] font-medium bg-transparent;
}
.default-field {
  @apply w-full h-full text-white font-medium placeholder:text-subtle bg-transparent;
}
.error {
  @apply text-right text-sm text-alert-error;
}
</style>
