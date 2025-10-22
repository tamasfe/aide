<script setup lang="ts">
import type { RestrictLicenseNoAlternativePayload } from "~/types/hooks";

const siteStore = useSiteStore();
const nuxtApp = useNuxtApp();
const open = ref(false);
const payload = ref<RestrictLicenseNoAlternativePayload | null>(null);

useRuntimeHook("frontend:command:modal:restrict-license-no-alternative:open", (data) => {
  payload.value = data;
  open.value = true;
});

useRuntimeHook("frontend:command:modal:restrict-license-no-alternative:close", () => {
  open.value = false;
});

useRuntimeHook("frontend:command:modal:close", () => {
  open.value = false;
});

watch(open, (newValue) => {
  if (newValue) {
    nuxtApp.callHook("frontend:event:modal:restrict-license-no-alternative:opened");
  }
  else {
    nuxtApp.callHook("frontend:event:modal:restrict-license-no-alternative:closed");
    payload.value = null;
  }
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
    <div v-if="payload" class="flex flex-col items-center gap-4">
      <h1 class="text-2xl font-semibold text-center">
        {{ $t("modal_restrict.license_no_alternative_headline", {
          country: payload.blockedCountry,
          blockedName: siteStore.site.name,
        }) }}
      </h1>

      <div class="mb-4 text-emphasis text-center">
        {{ $t("modal_restrict.license_no_alternative_body", {
          country: payload.blockedCountry,
          blockedName: siteStore.site.name,
        }) }}
      </div>
    </div>
  </BaseModal>
</template>
