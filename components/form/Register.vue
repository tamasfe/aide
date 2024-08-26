<script setup lang="ts">
const { t } = useI18n();

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * currently shows CPF for all jurisdictions and it needs to be BR only
//   * the dropdown for the +1 prefix isnt done
//   * dynamic mask for phone based on loaded jurisdiction: NOTE: this must also handle multiple masks I believe. so mask or mask[]
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✴️

const error = ref();
const loading = ref(false);
</script>

<template>
  <BaseForm>
    <BaseAlert
      v-if="error"
      :message="error"
      level="error"
    />

    <BaseInputGroup
      :label="t('field.email')"
      autocomplete="email"
      inputmode="email"
    />

    <BaseInputGroup
      :label="t('field.password')"
      type="password"
      autocomplete="new-password"
    />

    <BaseInputGroup
      :label="t('field.cpf')"
      mask="###.###.###-##"
      inputmode="numeric"
    />

    <BaseInputGroup
      :label="t('field.telephone')"
      mask="123"
      inputmode="numeric"
    />

    <div class="my-2 text-sm text-center text-subtle">
      {{ t("modal_auth.accept_terms") }}
      <NuxtLink
        to="/terms"
        target="_blank"
        class="font-semibold hover:text-subtle-light"
      >
        {{ t("page.terms") }}
      </NuxtLink>
    </div>

    <BaseButtonNew
      :loading="loading"
      size="xl"
      class="w-full space-x-1.5"
    >
      <span>{{ t("button.create_account") }}</span>
      <Icon
        name="lucide:arrow-right"
        size="20"
      />
    </BaseButtonNew>

    <div class="mt-6 text-center text-sm text-subtle">
      {{ t("modal_auth.have_account") }}

      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="text-primary hover:underline"
      >
        {{ t("button.login") }}
      </BaseButtonNew>
    </div>
  </BaseForm>
</template>
