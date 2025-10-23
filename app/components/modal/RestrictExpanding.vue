<script setup lang="ts">
import type { RestrictExpandingPayload } from "~/types/hooks";

const { t } = useI18n();
const siteStore = useSiteStore();
const nuxtApp = useNuxtApp();
const open = ref(false);
const payload = ref<RestrictExpandingPayload | null>(null);

useActiveModals("restrict-expanding", open);

useRuntimeHook("frontend:command:modal:restrict-expanding:open", (data) => {
  payload.value = data;
  open.value = true;
});

useRuntimeHook("frontend:command:modal:restrict-expanding:close", () => {
  open.value = false;
});

useRuntimeHook("frontend:command:modal:close", () => {
  open.value = false;
});

watch(open, (newValue) => {
  if (newValue) {
    nuxtApp.callHook("frontend:event:modal:restrict-expanding:opened");
  }
  else {
    nuxtApp.callHook("frontend:event:modal:restrict-expanding:closed");
    payload.value = null;
  }
});

const notifyMe = () => {
  if (!payload.value) {
    return;
  }

  const notifyMeEmailSubject = t("modal_restrict.expanding_subject", {
    country: payload.value.blockedCountry,
    blockedName: siteStore.site.name,
  });

  window.location.href = `mailto:${siteStore.currentDomain.email}?subject=${encodeURIComponent(notifyMeEmailSubject)}`;
};
</script>

<template>
  <BaseModal
    id="modal-restrict-expanding"
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
        {{ $t("modal_restrict.expanding_headline", {
          country: payload.blockedCountry,
          blockedName: siteStore.site.name,
        }) }}
      </h1>

      <div class="mb-4 text-emphasis text-center">
        {{ $t("modal_restrict.expanding_body", {
          country: payload.blockedCountry,
        }) }}
      </div>

      <BaseButton
        size="xl"
        class="w-full"
        @click="notifyMe"
      >
        {{ $t("button.notify_me") }}
      </BaseButton>
    </div>
  </BaseModal>
</template>
