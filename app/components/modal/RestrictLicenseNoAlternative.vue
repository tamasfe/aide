<script setup lang="ts">
const open = ref(true);

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * we need to load the appropriate domain
// TRANSLATION STATUS:  ✅

const siteStore = useSiteStore();

defineProps({
  blockedCountry: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <BaseModal
    id="modal-restrict-no-alternative"
    v-model:open="open"
    data-modal-is-juridiction-blocked="true"
    :close-on-click-outside="false"
    :unclosable="true"
    :logo="false"
    banner="top"
    :banner-top="siteStore.getRelativeAssetPath('banners/jurisdiction_horizontal.jpg')"
  >
    <div class="flex flex-col items-center gap-4">
      <h1 class="text-2xl font-semibold text-center">
        {{ $t("modal_restrict.license_no_alternative_headline", {
          country: blockedCountry,
          blockedDomain: capitalizeBrandDomain(siteStore.site.name),
        }) }}
      </h1>

      <div class="mb-4 text-emphasis text-center">
        {{ $t("modal_restrict.license_no_alternative_body", {
          country: blockedCountry,
          blockedDomain: capitalizeBrandDomain(siteStore.site.name),
        }) }}
      </div>
    </div>
  </BaseModal>
</template>
