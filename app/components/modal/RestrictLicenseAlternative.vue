<script setup lang="ts">
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
  allowedUrl: {
    type: String,
    required: true,
  },
  blockedCountry: {
    type: String,
    required: true,
  },
});

const allowedDomain = ref(new URL(props.allowedUrl).hostname);
</script>

<template>
  <BaseModal
    v-model:open="open"
    :close-on-click-outside="false"
    :unclosable="true"
    :logo="false"
    banner="top"
    banner-top="/assets/images/banners/jurisdiction_horizontal.jpg"
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

      <BaseLink :to="allowedUrl" :external="true" class="my-4">
        <BaseButton
          size="xl"
          class="w-full gap-1.5"
        >
          <span>{{ $t("button.take_me_to", { domain: capitalizeBrandDomain(allowedDomain) }) }}</span>
          <BaseIcon
            name="lucide:arrow-right"
            :size="20"
          />
        </BaseButton>
      </BaseLink>
    </div>
  </BaseModal>
</template>
