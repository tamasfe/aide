<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import type { PropType } from "vue";
import type { SupportedCountryFlagCode } from "@/types/constants";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * ✅ dynamic server validations for limits with zod (talk to Daniel)
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✅

const props = defineProps({
  paymentMethodId: {
    type: Number,
    required: true,
  },
  amounts: {
    type: Object as PropType<{ min: number | null; max: number | null }>,
    required: true,
  },
  currency: {
    type: Object as PropType<{
      code: WalletCurrency;
      countryCode: SupportedCountryFlagCode;
    }>,
    required: true,
  },
});

const presetAmounts = ref([10, 50, 100]);

const { $dependencies } = useNuxtApp();
const { t, locale } = useI18n();

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
    amount: schemaForAmount.transform(value => Number(value)),
  }),
);

const { handleSubmit, errors: formErrors, defineField, meta } = useForm({ validationSchema });
const formErrorMessage = ref("");
const loading = ref(false);
const [amount, amountAttrs] = defineField("amount");

const onSubmit = handleSubmit(async (formData) => {
  loading.value = true;
  formErrorMessage.value = "";

  formErrorMessage.value = await $dependencies.wallets.ui.createDepositFlowOnForm.handle(
    formData.amount,
    props.currency.code,
    props.paymentMethodId,
  );

  loading.value = false;
}, ({ results }) => {
  $dependencies.common.logger.warn("Validation failed", { validationResults: results });
});
</script>

<template>
  <BaseForm @submit="onSubmit">
    <div class="mb-2 leading-snug">
      <h2 class="text-xl font-semibold">{{ $t('modal_payments.make_deposit') }}</h2>
      <h3 class="text-sm font-medium text-subtle">{{ $t('modal_payments.make_deposit_subtitle') }}</h3>
    </div>

    <BaseAlert
      v-if="formErrorMessage"
      :message="formErrorMessage"
      level="error"
      class="mb-0.5"
    />

    <BaseInputGroup
      v-bind="amountAttrs"
      :placeholder="$t('placeholder.deposit_amount')"
      autocomplete="text"
      inputmode="decimal"
      placeholder-placement="default"
      error-placement="below"
      :model-value="String(amount)"
      :error-message="formErrors.amount"
      :mask="{
        number: {
          locale,
          fraction: 2,
          unsigned: true,
        },
      }"
      @input="(value) => amount = Number(value.replace(/[^\d.]/g, ''))"
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

    <div class="flex flex-row gap-2">
      <BaseButton
        v-for="(presetAmount, index) in presetAmounts"
        :key="index"
        variant="subtle"
        size="input"
        class="w-full bg-subtle hover:bg-subtle/80 text-white font-semibold text-lg"
        @click="amount = presetAmount"
      >
        <BaseCurrency :currency="currency.code" :value="presetAmount" variant="emphasis" />
      </BaseButton>
    </div>

    <BaseButton
      class="mt-4 mb-2 w-full"
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
