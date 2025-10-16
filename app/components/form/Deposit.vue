<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import type { PropType } from "vue";
import type { SupportedCountryFlagCode } from "@/types/constants";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
//   * ✅ dynamic server validations for limits with zod (talk to Daniel)
//   * ✅ dynamic payment methods from repository
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✅

const siteStore = useSiteStore();

const props = defineProps({
  paymentMethodId: {
    type: Number,
    required: true,
  },
  amounts: {
    type: Object as PropType<{ min: number | null; max: number | null }>,
    required: true,
  },
  paymentMethods: {
    type: Array as PropType<{ id: number; identifier: string; logo: string | null; title: string }[]>,
    required: false,
    default: () => [],
  },
  currency: {
    type: Object as PropType<{
      code: WalletCurrency;
      countryCode: SupportedCountryFlagCode;
    }>,
    required: true,
  },
});

const presetAmounts = ref<{ value: number; hot: boolean }[]>([
  {
    value: 10,
    hot: false,
  }, {
    value: 50,
    hot: true,
  }, {
    value: 100,
    hot: false,
  }, {
    value: 250,
    hot: false,
  }, {
    value: 500,
    hot: false,
  }, {
    value: 1000,
    hot: true,
  },
]);

const { $dependencies } = useNuxtApp();
const { t } = useI18n();

/**
 *
 * Form initialisation
 *
 */
let schemaForAmount = z.number({ required_error: t("validation.amount_required") });
if (props.amounts.min !== null) {
  schemaForAmount = schemaForAmount.min(props.amounts.min, t("validation.amount_deposit_min", { min: `${props.amounts.min} ${props.currency.code}` }));
}
if (props.amounts.max !== null) {
  schemaForAmount = schemaForAmount.max(props.amounts.max, t("validation.amount_deposit_max", { max: `${props.amounts.max} ${props.currency.code}` }));
}
const validationSchema = toTypedSchema(
  z.object({
    amount: schemaForAmount,
    paymentMethod: z.number(),
  }),
);

const { handleSubmit, errors: formErrors, defineField, meta } = useForm({ validationSchema });
const formErrorMessage = ref("");
const loading = ref(false);
const [amount, amountAttrs] = defineField("amount");
amount.value = presetAmounts.value[0]?.value;

const [paymentMethod, _paymentMethodAttrs] = defineField("paymentMethod");
paymentMethod.value = props.paymentMethods[0]?.id;

const onSubmit = handleSubmit(async (formData) => {
  loading.value = true;
  formErrorMessage.value = "";

  formErrorMessage.value = await $dependencies.wallets.ui.createDepositFlowOnForm.handle(
    formData.amount,
    props.currency.code,
    formData.paymentMethod,
  );

  loading.value = false;
}, ({ results }) => {
  $dependencies.common.logger.warn("Validation failed", { validationResults: results });
});
</script>

<template>
  <BaseForm @submit="onSubmit">
    <BaseAlert
      v-if="formErrorMessage"
      :message="formErrorMessage"
      level="error"
      class="mb-0.5"
    />

    <!-- Mask example gotten from the official docs "money simple" example (https://beholdr.github.io/maska/v3/#/) -->
    <BaseInputGroup
      v-bind="amountAttrs"
      v-model.number="amount"
      :placeholder="$t('placeholder.deposit_amount')"
      autocomplete="text"
      inputmode="decimal"
      placeholder-placement="default"
      error-placement="below"
      :error-message="formErrors.amount"
      :mask="{ type: 'money' }"
    >
      <template #prefix>
        <!-- TODO in the future: make this part multi-currency friendly -->
        <div class="self-center mr-2 font-semibold text-lg bg-button-emphasis text-transparent bg-clip-text">
          R$
        </div>
      </template>
      <template #suffix>
        <div class="ml-5 flex flex-row justify-center items-center gap-1.5">
          <BaseFlag :country-code="currency.countryCode" />
          <div class="text-sm font-medium text-subtle-light">{{ currency.code }}</div>
        </div>
      </template>
    </BaseInputGroup>

    <div class="grid grid-cols-3 gap-2 mb-4">
      <BaseButton
        v-for="({ value: presetAmount, hot }, index) in presetAmounts"
        :key="index"
        variant="ghost"
        class="overflow-hidden relative w-full text-white font-semibold text-base xs:text-lg"
        :class="[presetAmount === amount ? 'bg-active ring-1 ring-success' : 'bg-subtle md:hover:bg-subtle/80']"
        @click="amount = presetAmount"
      >
        <BaseCurrency
          :currency="currency.code"
          :value="presetAmount"
          trailing-zero-display="stripIfInteger"
          variant="emphasis"
        />
        <div
          v-if="hot"
          class="absolute bg-button-primary top-0 right-0 text-[0.5rem] uppercase rounded-bl px-1 text-button-emphasis font-bold"
        >
          {{ $t('button.popular') }}
        </div>
        <div
          class="absolute bg-button-emphasis bottom-0 right-0 text-[0.5rem] uppercase rounded-tl px-1 text-button-emphasis font-bold transition-opacity duration-100"
          :class="[presetAmount === amount ? 'opacity-100' : 'opacity-0']"
        >
          <BaseIcon
            name="lucide:check"
            :size="12"
            class="text-inherit"
          />
        </div>
      </BaseButton>
    </div>

    <div class="mb-2">
      <h3 class="">
        {{ $t("modal_payments.select_payment_method") }}
      </h3>
      <p class="text-subtle text-sm">
        {{ $t("modal_payments.select_payment_method_subtitle") }}
      </p>
    </div>

    <div class="grid grid-cols-3 gap-2 mb-4">
      <BaseButton
        v-for="{ id, logo, title } in paymentMethods"
        :key="id"
        variant="ghost"

        class="overflow-hidden relative w-full text-white font-semibold text-base xs:text-lg"
        :class="[paymentMethod === id ? 'bg-active ring-1 ring-success' : 'bg-subtle md:hover:bg-subtle/80']"
        @click="paymentMethod = id"
      >
        <NuxtImg
          v-if="logo"
          :src="siteStore.getRelativeAssetPath(logo)"
          :alt="title"
        />
        <div
          v-else
          class="capitalize"
        >
          {{ title }}
        </div>
        <div
          class="absolute bg-button-emphasis bottom-0 right-0 text-[0.5rem] uppercase rounded-tl px-1 text-button-emphasis font-bold transition-opacity duration-100"
          :class="[paymentMethod === id ? 'opacity-100' : 'opacity-0']"
        >
          <BaseIcon
            name="lucide:check"
            :size="12"
            class="text-inherit"
          />
        </div>
      </BaseButton>
    </div>

    <BaseButton
      class="w-full"
      :disabled="!meta.valid"
      :loading="loading"
      size="xl"
      type="submit"
      variant="emphasis"
    >
      {{ $t("button.deposit_now") }}
    </BaseButton>
  </BaseForm>
</template>
