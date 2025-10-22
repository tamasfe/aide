<script setup lang="ts">
import type { RestrictLicenseAlternativePayload } from "~/types/hooks";

const siteStore = useSiteStore();
const nuxtApp = useNuxtApp();
const open = ref(false);
const payload = ref<RestrictLicenseAlternativePayload | null>(null);

useRuntimeHook("frontend:command:modal:restrict-license-alternative:open", (data) => {
  payload.value = data;
  open.value = true;
});

useRuntimeHook("frontend:command:modal:restrict-license-alternative:close", () => {
  open.value = false;
});

useRuntimeHook("frontend:command:modal:close", () => {
  open.value = false;
});

watch(open, (newValue) => {
  if (newValue) {
    nuxtApp.callHook("frontend:event:modal:restrict-license-alternative:opened");
  }
  else {
    nuxtApp.callHook("frontend:event:modal:restrict-license-alternative:closed");
    payload.value = null;
  }
});

const allowedDomain = computed(() => {
  return new URL(payload.value!.allowedUrl).hostname;
});
</script>

<template>
  <BaseModal
    id="modal-restrict-license-alternative"
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
        {{ $t("modal_restrict.license_alternative_headline", {
          country: payload.blockedCountry,
          allowedDomain,
        }) }}
      </h1>

      <div class="text-emphasis text-center mb-4">
        {{ $t("modal_restrict.license_alternative_body", {
          country: payload.blockedCountry,
          blockedName: siteStore.site.name,
          allowedDomain,
        }) }}
      </div>

      <NuxtLinkLocale :to="payload.allowedUrl" external>
        <BaseButton
          size="xl"
          class="w-full gap-1.5"
        >
          <span>{{ $t("button.take_me_to", { domain: allowedDomain }) }}</span>
          <BaseIcon
            name="lucide:arrow-right"
            :size="20"
          />
        </BaseButton>
      </NuxtLinkLocale>
    </div>
  </BaseModal>
</template>
