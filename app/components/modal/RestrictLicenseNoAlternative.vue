<script setup lang="ts">
const open = ref(true);

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * we need to load the appropriate domain
// TRANSLATION STATUS:  ✅
const blockedDomain = ref("girobet.com");

defineProps({
  blockedCountry: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <BaseModal
    v-model:open="open"
    :close-on-click-outside="false"
    :unclosable="true"
    banner="top"
    banner-top="/assets/images/jurisdiction_horizontal.jpg"
  >
    <div class="flex flex-col items-center gap-4">
      <h1 class="text-2xl font-semibold text-center">
        {{ $t("modal_restrict.license_no_alternative_headline", {
          country: blockedCountry,
          blockedDomain: capitalizeBrandDomain(blockedDomain),
        }) }}
      </h1>

      <div class="mb-4 text-emphasis text-center">
        {{ $t("modal_restrict.license_no_alternative_body", {
          country: blockedCountry,
          blockedDomain: capitalizeBrandDomain(blockedDomain),
        }) }}
      </div>
    </div>
  </BaseModal>
</template>
