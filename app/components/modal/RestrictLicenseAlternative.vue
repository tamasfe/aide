<script setup lang="ts">
const open = ref(true);

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * we need to load the appropriate domain
// TRANSLATION STATUS:  ✅

defineProps({
  blockedDomain: {
    type: String,
    required: true,
  },
  allowedDomain: {
    type: String,
    required: true,
  },
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
    banner-top="/assets/images/wheel-2.png"
  >
    <div class="flex flex-col items-center gap-4">
      <h1 class="text-2xl font-semibold text-center">
        {{ $t("modal_restrict.license_alternative_headline", {
          country: blockedCountry,
          allowedDomain: capitalizeBrandDomain(allowedDomain),
        }) }}
      </h1>

      <div class="text-emphasis text-center">
        {{ $t("modal_restrict.license_alternative_body", {
          country: blockedCountry,
          blockedDomain: capitalizeBrandDomain(blockedDomain),
          allowedDomain: capitalizeBrandDomain(allowedDomain),
        }) }}
      </div>

      <BaseButton
        size="xl"
        class="my-4 w-full gap-1.5"
      >
        <span>{{ $t("button.take_me_to", { domain: capitalizeBrandDomain(allowedDomain) }) }}</span>
        <BaseIcon
          name="lucide:arrow-right"
          :size="20"
        />
      </BaseButton>
    </div>
  </BaseModal>
</template>
