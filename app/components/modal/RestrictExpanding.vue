<script setup lang="ts">
const { t } = useI18n();
const open = ref(true);

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * we need to load the appropriate domain
// TRANSLATION STATUS:  ✅
const blockedDomain = ref("girobet.com");
const country = ref("Brazil"); // request IP jurisdiction

const onNotify = () => {
  const domain = t("modal_restrict.expanding_subject", {
    country: country.value,
    blockedDomain: normalizeBrandDomain(blockedDomain.value),
  });
  window.location.href = `mailto:support@girobet.com?subject=${encodeURIComponent(domain)}`;
};
</script>

<template>
  <BaseModal
    v-model:open="open"
    :disabled="true"
    :close-on-click-outside="false"
    banner="top"
    banner-top="/assets/images/wheel-2.png"
  >
    <div class="flex flex-col items-center gap-4">
      <h1 class="text-2xl font-semibold text-center">
        {{ $t("modal_restrict.expanding_headline", {
          country,
          blockedDomain: normalizeBrandDomain(blockedDomain),
        }) }}
      </h1>

      <div class="mb-4 text-emphasis text-center">
        {{ $t("modal_restrict.expanding_body", { country }) }}
      </div>

      <BaseButton
        size="xl"
        class="my-4 w-full"
        @click="onNotify"
      >
        {{ $t("button.notify_me") }}
      </BaseButton>
    </div>
  </BaseModal>
</template>
