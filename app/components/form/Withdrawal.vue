<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import type { SupportedCountryFlagCode } from "@/types/constants";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

// DESIGN STATUS:       ✴️
//   - finish withdrawal cpf fields just like on bet7k (ignore design)
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✅

const props = defineProps<{
  limits: { min: number | null; max: number | null; cooldownSeconds: number | null };
  currency: {
    code: WalletCurrency;
    countryCode: SupportedCountryFlagCode;
  };
  paymentMethodId: number;
}>();

const showLimits = ref(false);
const onToggleLimits = () => {
  showLimits.value = !showLimits.value;
};

/**
 *
 * Form initialisation
 *
 */
const { $dependencies } = useNuxtApp();
const { t } = useI18n();
let schemaForAmount = z.number({ required_error: t("validation.amount_required") });
if (props.limits.min !== null) {
  schemaForAmount = schemaForAmount.min(props.limits.min, t("validation.amount_withdrawal_min", { min: `${props.limits.min} ${props.currency.code}` }));
}
if (props.limits.max !== null) {
  schemaForAmount = schemaForAmount.max(props.limits.max, t("validation.amount_withdrawal_max", { max: `${props.limits.max} ${props.currency.code}` }));
}
const validationSchema = toTypedSchema(
  z.object({ amount: schemaForAmount }),
);

const { handleSubmit, errors: formErrors, defineField, meta } = useForm({ validationSchema });
const formErrorMessage = ref("");
const loading = ref(false);
const [amount, amountAttrs] = defineField("amount");

const onSubmit = handleSubmit(async (formData) => {
  loading.value = true;
  formErrorMessage.value = "";

  formErrorMessage.value = await $dependencies.wallets.ui.createWithdrawalFlowOnForm.handle(
    formData.amount,
    props.currency.code,
    props.paymentMethodId,
  );

  loading.value = false;
  if (!formErrorMessage.value) {
    $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
  }
}, ({ results }) => {
  $dependencies.common.logger.warn("Validation failed", { validationResults: results });
});
</script>

<template>
  <BaseForm @submit="onSubmit">
    <div class="flex justify-between">
      <div class="mb-2 leading-snug">
        <h2 class="text-xl font-semibold">{{ $t('modal_payments.make_withdrawal') }}</h2>
        <h3 class="text-sm font-medium text-subtle">{{ $t('modal_payments.make_withdrawal_subtitle') }}</h3>
      </div>

      <div
        class="p-1 flex self-start items-center space-x-1.5 cursor-pointer text-primary hover:text-primary-hover"
        @click="onToggleLimits"
      >
        <BaseIcon
          name="lucide:info"
          :size="18"
        />
        <div>{{ $t('modal_payments.limits') }}</div>
      </div>
    </div>

    <template v-if="!showLimits">
      <BaseAlert
        v-if="formErrorMessage"
        class="mb-0.5"
        level="error"
        :message="formErrorMessage"
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

      <div v-if="limits.max" class="flex space-x-2 font-medium text-sm">
        <div class="text-subtle">{{ $t('modal_payments.available_withdraw') }}:</div>
        <div class="text-subtle-light font-semibold">
          <BaseCurrency :value="limits.max" :currency="currency.code" variant="ghost" />
        </div>
      </div>

      <BaseButton
        class="mt-4 mb-2 w-full"
        :disabled="!meta.valid"
        :loading="loading"
        size="xl"
        type="submit"
        variant="primary"
      >
        {{ $t("button.withdraw") }}
      </BaseButton>
    </template>
    <template v-else>
      <InfoWithdrawalLimits
        :min="limits.min"
        :max="limits.max"
        :cooldown-seconds="limits.cooldownSeconds"
        :bets-to-enable-withdrawal="null"
        :currency="currency.code"
      />

      <BaseButton
        variant="subtle"
        class="mt-2"
        @click="onToggleLimits"
      >
        {{ $t("button.go_back") }}
      </BaseButton>
    </template>
  </BaseForm>
</template>
