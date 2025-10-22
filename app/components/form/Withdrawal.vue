<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";
import type { PaymentLimits } from "~/modules/wallet/domain/PaymentLimits";

// DESIGN STATUS:       ✴️
//   - finish withdrawal cpf fields just like on bet7k (ignore design)
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✅

const props = defineProps<{
  paymentMethodLimits: PaymentLimits;
  userUnlockedBalance: number | null;
  currency: WalletCurrency;
  paymentMethodId: number;
}>();

const showLimits = ref(false);
const onToggleLimits = () => {
  showLimits.value = !showLimits.value;
};

const maximumWithdrawal = computed(() => {
  if (typeof props.paymentMethodLimits.withdrawalMax === "number" && props.userUnlockedBalance !== null) {
    return Math.min(props.paymentMethodLimits.withdrawalMax, props.userUnlockedBalance);
  }
  return props.paymentMethodLimits.withdrawalMax ?? props.userUnlockedBalance ?? null;
});

/**
 *
 * Form initialisation
 *
 */
const { t } = useI18n();
const logger = useLogger();
const wallet = useWalletModule();
const nuxtApp = useNuxtApp();

let schemaForAmount = z.number({ required_error: t("validation.amount_required") });
if (typeof props.paymentMethodLimits.withdrawalMin === "number") {
  schemaForAmount = schemaForAmount.min(props.paymentMethodLimits.withdrawalMin, t("validation.amount_withdrawal_min", { min: `${props.paymentMethodLimits.withdrawalMin}` }));
}
// if (maximumWithdrawal.value !== null) {
//   schemaForAmount = schemaForAmount.max(maximumWithdrawal.value, t("validation.amount_withdrawal_max", { max: `${maximumWithdrawal.value}` }));
// }
const validationSchema = toTypedSchema(
  z.object({ amount: schemaForAmount }),
);

const { handleSubmit, errors: formErrors, defineField, meta } = useForm({ validationSchema });
const formError = ref<null | { message: string; cta?: { label: string; action: () => void } }>(null);
const loading = ref(false);
const [amount, amountAttrs] = defineField("amount");
amount.value = undefined;

const countryCode = useCurrencyToIcon(props.currency);

const onSubmit = handleSubmit(async (formData) => {
  loading.value = true;
  formError.value = null;

  const { cta, message } = await wallet.ui.createWithdrawalFlowOnForm.handle(
    formData.amount,
    props.currency,
    props.paymentMethodId,
  );

  loading.value = false;
  if (!message) {
    nuxtApp.callHook("frontend:command:modal:close");
  }

  formError.value = {
    message,
    cta,
  };
}, ({ results }) => {
  logger.warn("Validation failed", { validationResults: results });
});
</script>

<template>
  <BaseForm @submit="onSubmit">
    <template v-if="!showLimits">
      <BaseAlert
        v-if="formError"
        class="mb-0.5 block h-auto"
        level="error"
        :message="formError.message"
      >
        <BaseButton
          v-if="formError.cta"
          variant="ghost"
          size="sm"
          class="underline"
          @click="formError.cta.action"
        >
          {{ formError.cta.label }}
        </BaseButton>
      </BaseAlert>

      <BaseInputGroup
        v-bind="amountAttrs"
        :placeholder="$t('placeholder.withdrawal_amount')"
        autocomplete="text"
        inputmode="decimal"
        placeholder-placement="default"
        error-placement="below"
        :error-message="formErrors.amount"
        :mask="{ type: 'money' }"
        :model-value="amount"
        @input="(value) => amount = Number(value.replace(/[^\d.]/g, ''))"
      >
        <template #prefix>
          <BaseCurrency
            :currency="currency"
            variant="ghost"
            class="self-center mr-2 font-semibold text-lg bg-button-emphasis text-transparent bg-clip-text"
          />
        </template>
        <template #suffix>
          <div class="ml-5 flex flex-row justify-center items-center gap-1.5">
            <BaseFlag :country-code="countryCode" />
            <div class="text-sm font-medium text-subtle-light">
              {{ currency }}
            </div>
          </div>
        </template>
      </BaseInputGroup>

      <div class="flex justify-between items-center cursor-pointer" @click="onToggleLimits">
        <div class="flex justify-between">
          <div
            class="flex self-start items-center space-x-1.5 text-primary text-sm md:hover:text-primary-hover p-4 -m-4"
          >
            <BaseIcon
              name="lucide:info"
              :size="15"
            />
            <div class="hover:underline">
              {{ $t('modal_payments.limits') }}
            </div>
          </div>
        </div>
        <div v-if="maximumWithdrawal !== null" class="flex space-x-2 font-medium text-sm">
          <div class="text-subtle">
            {{ $t('modal_payments.available_withdraw') }}:
          </div>
          <div class="text-subtle-light font-semibold">
            <BaseCurrency :value="maximumWithdrawal" :currency="currency" variant="ghost" />
          </div>
        </div>
      </div>

      <BaseButton
        class=" w-full mt-4"
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
        :min="paymentMethodLimits.withdrawalMin ?? null"
        :max="maximumWithdrawal"
        :cooldown-seconds="paymentMethodLimits.withdrawalCooldown ?? null"
        :currency="currency"
        :unlocked-balance="userUnlockedBalance"
        :timeframe-limits="paymentMethodLimits.timeframeLimits"
      />

      <BaseButton
        variant="subtle"
        class="mt-4"
        @click="onToggleLimits"
      >
        {{ $t("button.go_back") }}
      </BaseButton>
    </template>
  </BaseForm>
</template>
