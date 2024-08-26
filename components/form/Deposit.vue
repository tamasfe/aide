<script setup lang="ts">
const { t } = useI18n();

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✴️

const loading = ref(true);
</script>

<template>
  <BaseForm>
    <BaseInputGroup
      :label="t('placeholder.deposit_amount')"
      autocomplete="text"
      inputmode="numeric"
    />

    <BaseButtonNew
      :loading="loading"
      variant="emphasis"
      size="xl"
      class="w-full"
    >
      {{ t("button.deposit_now") }}
    </BaseButtonNew>
  </BaseForm>
</template>
