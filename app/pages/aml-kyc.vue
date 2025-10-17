<script setup lang="ts">
import { ErrorTranslatedContentNotFound } from "~/packages/translation/domain/ErrorTranslatedContentNotFound";

const url = useRequestURL();
const { t } = useI18n();
const { $dependencies } = useNuxtApp();

useHead({
  title: t("page.aml_kyc"),
});

const { locale } = useI18n();

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = false;

const { data: pageAml } = useAsyncData("aml-policy-" + locale.value, async () => {
  const content = await queryCollection("terms_pages").path(`/${locale.value}/aml_policy`).first();

  if (!content) {
    $dependencies.common.logger.error(`!! AML Policy content not found, this is critical as the user may see a blank page for a required legal document`, new ErrorTranslatedContentNotFound(locale.value, "aml_policy"));
  }
  return content;
}, {
  watch: [() => locale.value], // Refetch when locale changes
  lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING,
});

const { data: pageKyc } = useAsyncData("kyc-policy-" + locale.value, async () => {
  const content = await queryCollection("terms_pages").path(`/${locale.value}/kyc_policy`).first();

  if (!content) {
    $dependencies.common.logger.error(`!! KYC Policy content not found, this is critical as the user may see a blank page for a required legal document`, new ErrorTranslatedContentNotFound(locale.value, "kyc_policy"));
  }
  return content;
}, {
  watch: [() => locale.value], // Refetch when locale changes
  lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING,
});
</script>

<template>
  <div>
    <AppPage
      v-if="pageAml"
      :title="pageAml.title"
      :version="pageAml.version"
      :date="pageAml.date"
      :show-print-button="true"
    >
      <ContentRenderer :value="pageAml" :data="{ url }" />
    </AppPage>

    <AppPage
      v-if="pageKyc"
      class="mt-12"
      :title="pageKyc.title"
      :version="pageKyc.version"
      :date="pageKyc.date"
      :show-print-button="true"
    >
      <ContentRenderer :value="pageKyc" />
    </AppPage>
  </div>
</template>
