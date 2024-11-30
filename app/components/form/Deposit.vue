<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import type { SupportedCountryFlagCode } from "@/types/constants";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * dynamic server validations for limits with zod (talk to Daniel)
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✴️

const presetAmounts = ref([10, 50, 100]);
const currency = ref<{
  code: WalletCurrency;
  countryCode: SupportedCountryFlagCode;
}>({
  code: "BRL",
  countryCode: "BR",
});
const DEPOSIT_AMOUNT_MINIMUM = 5; // Set by us
const DEPOSIT_AMOUNT_MAXIMUM = 1000; // Max PIX transaction amount between different individuals at night (source: https://www.idinheiro.com.br/bancos/quais-sao-os-limites-de-ted-e-doc/)

const { $dependencies } = useNuxtApp();
const { t } = useI18n();

const validationSchema = toTypedSchema(
  z.object({
    amount: z.number({ required_error: t("validation.amount_deposit_required") })
      .min(DEPOSIT_AMOUNT_MINIMUM, t("validation.amount_deposit_min", { min: `${DEPOSIT_AMOUNT_MINIMUM} ${currency.value.code}` }))
      .max(DEPOSIT_AMOUNT_MAXIMUM, t("validation.amount_deposit_max", { max: `${DEPOSIT_AMOUNT_MAXIMUM} ${currency.value.code}` }))
      .transform(value => Number(value)),
  }),
);

const { handleSubmit, errors: formErrors, defineField, meta } = useForm({ validationSchema });
const formErrorMessage = ref("");
const loading = ref(false);
const [amount, amountAttrs] = defineField("amount");

const onSubmit = handleSubmit(async (formData) => {
  loading.value = true;
  formErrorMessage.value = "";

  const errorSubmitting = await $dependencies.wallets.ui.createPixDepositFlowOnForm.handle(
    formData.amount,
  );

  formErrorMessage.value = errorSubmitting;
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
      v-model.number="amount"
      :placeholder="$t('placeholder.deposit_amount')"
      autocomplete="text"
      inputmode="numeric"
      placeholder-placement="default"
      error-placement="below"
      :error-message="formErrors.amount"
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
