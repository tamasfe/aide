<script setup lang="ts">
const open = ref(true);

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * we need to load the appropriate domain
// TRANSLATION STATUS:  ✅
const blockedDomain = ref("girobet.com");
const allowedDomain = ref("giro.vip");
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
        {{ $t("modal_restrict.license_alternative_headline", {
          country,
          allowedDomain: normalizeBrandDomain(allowedDomain),
        }) }}
      </h1>

      <div class="text-emphasis text-center">
        {{ $t("modal_restrict.license_alternative_body", {
          country,
          blockedDomain: normalizeBrandDomain(blockedDomain),
          allowedDomain: normalizeBrandDomain(allowedDomain),
        }) }}
      </div>

      <BaseButton
        size="xl"
        class="my-4 w-full gap-1.5"
      >
        <span>{{ $t("button.take_me_to", { domain: normalizeBrandDomain(allowedDomain) }) }}</span>
        <Icon
          name="lucide:arrow-right"
          size="20"
        />
      </BaseButton>
    </div>
  </BaseModal>
</template>
