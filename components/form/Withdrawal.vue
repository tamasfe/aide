<script setup lang="ts">
import type { SupportedCountryCode } from "@/types/constants";

const { t } = useI18n();

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✴️

const loading = ref(false);
const countryCode = ref<SupportedCountryCode>("BR");
const currency = ref("BRL");

const showLimits = ref(false);

const onToggleLimits = () => {
  showLimits.value = !showLimits.value;
};
</script>

<template>
  <BaseForm>
    <div class="flex justify-between">
      <div class="mb-2 leading-snug">
        <h2 class="text-xl font-semibold">{{ t('modal_payments.make_withdrawal') }}</h2>
        <h3 class="text-sm font-medium text-subtle">{{ t('modal_payments.make_withdrawal_subtitle') }}</h3>
      </div>

      <div
        class="p-1 flex self-start items-center space-x-1.5 cursor-pointer text-primary hover:text-primary-hover"
        @click="onToggleLimits"
      >
        <Icon
          name="lucide:info"
          size="18"
        />
        <div>{{ t('modal_payments.limits') }}</div>
      </div>
    </div>

    <template v-if="!showLimits">
      <BaseInputGroup
        :placeholder="t('placeholder.deposit_amount')"
        autocomplete="text"
        inputmode="numeric"
        placeholder-placement="default"
        error-placement="below"
      >
        <template #prefix>
          <div class="self-center mr-2 font-semibold text-lg bg-button-emphasis text-transparent bg-clip-text">R$</div>
        </template>
        <template #suffix>
          <div class="ml-5 flex flex-row justify-center items-center gap-1.5">
            <BaseFlag :country-code="countryCode" />
            <div class="text-sm font-medium text-subtle-light">{{ currency }}</div>
          </div>
        </template>
      </BaseInputGroup>

      <div class="flex space-x-2 font-medium text-sm">
        <div class="text-subtle">{{ t('modal_payments.available_withdraw') }}:</div>
        <div class="text-subtle-light font-semibold">$R 42,069.00</div>
      </div>

      <BaseButtonNew
        :loading="loading"
        variant="emphasis"
        size="xl"
        class="mt-4 mb-2 w-full"
      >
        {{ t("button.withdraw") }}
      </BaseButtonNew>
    </template>
    <template v-else>
      <InfoWithdrawalLimits />

      <BaseButtonNew
        variant="subtle"
        class="mt-2"
        @click="onToggleLimits"
      >
        {{ t("button.go_back") }}
      </BaseButtonNew>
    </template>
  </BaseForm>
</template>
