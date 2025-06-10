<script setup lang="ts">
const open = ref(true);
const siteStore = useSiteStore();

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * we need to load the appropriate domain
// TRANSLATION STATUS:  ✅

const props = defineProps({
  blockedDomain: {
    type: String,
    required: true,
  },
  allowedUrl: {
    type: String,
    required: true,
  },
  blockedCountry: {
    type: String,
    required: true,
  },
});

const allowedDomain = (() => {
  try {
    return ref(capitalize(capitalizeBrandDomain(new URL(props.allowedUrl).hostname)));
  }
  catch (error) {
    console.error("Invalid URL provided for allowedUrl prop:", { allowedUrl: props.allowedUrl, error });
    return ref(capitalize(capitalizeBrandDomain(props.allowedUrl)));
  }
})();
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
    :banner-top="siteStore.getAssetPath('images/banners/jurisdiction_horizontal.jpg')"
  >
    <div class="flex flex-col items-center gap-4">
      <h1 class="text-2xl font-semibold text-center">
        {{ $t("modal_restrict.license_alternative_headline", {
          country: blockedCountry,
          allowedDomain,
        }) }}
      </h1>

      <div class="text-emphasis text-center mb-4">
        {{ $t("modal_restrict.license_alternative_body", {
          country: blockedCountry,
          blockedDomain: capitalizeBrandDomain(siteStore.site?.name || blockedDomain),
          allowedDomain,
        }) }}
      </div>

      <BaseLink :to="allowedUrl" :external="true">
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
      </BaseLink>
    </div>
  </BaseModal>
</template>
