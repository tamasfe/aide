<script setup lang="ts">
import type { SupportedCountryCode } from "@/types/constants";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✴️

const loading = ref(false);
const presetAmounts = ref([10, 50, 100]);
const countryCode = ref<SupportedCountryCode>("BR");
const currency = ref("BRL");
</script>

<template>
  <BaseForm>
    <div class="mb-2 leading-snug">
      <h2 class="text-xl font-semibold">{{ $t('modal_payments.make_deposit') }}</h2>
      <h3 class="text-sm font-medium text-subtle">{{ $t('modal_payments.make_deposit_subtitle') }}</h3>
    </div>

    <BaseInputGroup
      :placeholder="$t('placeholder.deposit_amount')"
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

    <div class="flex flex-row gap-2">
      <BaseButton
        v-for="(amount, index) in presetAmounts"
        :key="index"
        variant="subtle"
        size="input"
        class="w-full bg-subtle hover:bg-subtle/80 text-white font-semibold text-lg"
      >
        <div class="mr-1 bg-button-emphasis text-transparent bg-clip-text">R$</div>
        {{ amount }}
      </BaseButton>
    </div>

    <BaseButton
      :loading="loading"
      variant="emphasis"
      size="xl"
      class="mt-4 mb-2 w-full"
    >
      {{ $t("button.deposit_now") }}
    </BaseButton>
  </BaseForm>
</template>
