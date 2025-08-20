<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "vue";

/**
 * As of 2024/10/25: The component I18nN seems to have some weird thing going on. We need to use the named slots in order to give the
 * formatting we want it. But we find the following:
 *  1) when using :format={style: 'currency'} the named slots just plain do not work. Period.
 *  2) when specifying a custom number format, specified in the in the i18n.config.ts file (here also called currency”)
 *  and telling the component to use that custom number format through the "key" attribute: slots DO work as expected…
 *  But the intellisense says that the key attribute is not recognised. Even tough that attribute is mentioned in
 *  the official documentation (https://vue-i18n.intlify.dev/guide/essentials/number.html#custom-formatting)
 *
 *  So what we do is extend the expected type with the "key" attribute and use that to specify the custom number format.
 *  In the future, if the library starts accepting this "key" attribute, we can remove this workaround.
 */
interface ExtendedNumberFormatOptions extends Intl.NumberFormatOptions {
  key?: string;
}

const currencyVariants = cva(
  "",
  {
    variants: {
      variant: {
        primary: "mr-2 bg-button-primary text-transparent bg-clip-text",
        emphasis: "mr-2 bg-button-emphasis text-transparent bg-clip-text",
        ghost: "",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

type CurrencyVariants = VariantProps<typeof currencyVariants>;

const props = defineProps({
  /**
   * 3 letter currency code
   */
  currency: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  variant: {
    type: String as PropType<CurrencyVariants["variant"]>,
    default: "primary" as const,
  },
  trailingZeroDisplay: {
    type: String as PropType<ExtendedNumberFormatOptions["trailingZeroDisplay"]>,
    default: "auto",
  },
  class: {
    type: String as PropType<HTMLAttributes["class"]>,
    required: false,
  },
});
</script>

<template>
  <I18nN
    :class="cn('flex items-center tabular-nums', props.class)"
    scope="global"
    tag="span"
    :value="value"
    :format="{ key: 'currency', currency, trailingZeroDisplay } as ExtendedNumberFormatOptions"
  >
    <template #currency="slotProps">
      <span :class="currencyVariants({ variant })">{{ slotProps.currency }}</span>
    </template>
    <template #integer="slotProps">
      <span>{{ slotProps.integer }}</span>
    </template>
  </I18nN>
</template>
