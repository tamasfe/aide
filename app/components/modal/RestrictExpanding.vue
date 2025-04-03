<script setup lang="ts">
const { t } = useI18n();
const siteStore = useSiteStore();
const open = ref(true);

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * we need to load the appropriate domain
// TRANSLATION STATUS:  ✅

const props = defineProps({
  blockedDomain: {
    type: String,
    required: true,
  },
  blockedCountry: {
    type: String,
    required: true,
  },
});

const onNotify = () => {
  const notifyMeEmailSubject = t("modal_restrict.expanding_subject", {
    country: props.blockedCountry,
    blockedDomain: capitalizeBrandDomain(props.blockedDomain),
  });
  window.location.href = `${siteStore.currentDomain.email}?subject=${encodeURIComponent(notifyMeEmailSubject)}`;
};
</script>

<template>
  <BaseModal
    id="modal-restrict-expanding"
    v-model:open="open"
    :close-on-click-outside="false"
    :unclosable="true"
    :logo="false"
    banner="top"
    :banner-top="siteStore.getAssetPath('images/banners/jurisdiction_horizontal.jpg')"
  >
    <div class="flex flex-col items-center gap-4">
      <h1 class="text-2xl font-semibold text-center">
        {{ $t("modal_restrict.expanding_headline", {
          country: blockedCountry,
          blockedDomain: capitalizeBrandDomain(blockedDomain),
        }) }}
      </h1>

      <div class="mb-4 text-emphasis text-center">
        {{ $t("modal_restrict.expanding_body", { country: blockedCountry }) }}
      </div>

      <BaseButton
        size="xl"
        class="w-full"
        @click="onNotify"
      >
        {{ $t("button.notify_me") }}
      </BaseButton>
    </div>
  </BaseModal>
</template>
