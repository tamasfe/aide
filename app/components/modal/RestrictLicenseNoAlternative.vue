<script setup lang="ts">
const open = ref(true);

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * we need to load the appropriate domain
// TRANSLATION STATUS:  ✅
const blockedDomain = ref("girobet.com");
const country = ref("Brazil"); // request IP jurisdiction
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
        {{ $t("modal_restrict.license_no_alternative_headline", {
          country,
          blockedDomain: capitalizeBrandDomain(blockedDomain),
        }) }}
      </h1>

      <div class="mb-4 text-emphasis text-center">
        {{ $t("modal_restrict.license_no_alternative_body", {
          country,
          blockedDomain: capitalizeBrandDomain(blockedDomain),
        }) }}
      </div>
    </div>
  </BaseModal>
</template>
