<script setup lang="ts">
const { t } = useI18n();

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✴️

const presetAmounts = ref([10, 50, 100]);

const loading = ref(false);
</script>

<template>
  <BaseForm>
    <div class="mb-2 leading-snug">
      <h2 class="text-xl font-semibold">{{ t('modal_payments.make_deposit') }}</h2>
      <h3 class="text-sm font-medium text-subtle">{{ t('modal_payments.make_deposit_subtitle') }}</h3>
    </div>

    <BaseInputGroup
      :label="t('placeholder.deposit_amount')"
      autocomplete="text"
      inputmode="numeric"
    />

    <div class="flex flex-row gap-2">
      <BaseButtonNew
        v-for="(amount, index) in presetAmounts"
        :key="index"
        variant="subtle"
        size="input"
        class="w-full bg-subtle hover:bg-subtle/80 text-white font-semibold text-lg"
      >
        <div class="mr-1 bg-button-emphasis text-transparent bg-clip-text">R$</div>
        {{ amount }}
      </BaseButtonNew>
    </div>

    <BaseButtonNew
      :loading="loading"
      variant="emphasis"
      size="xl"
      class="mt-4 w-full"
    >
      {{ t("button.deposit_now") }}
    </BaseButtonNew>
  </BaseForm>
</template>
