<script setup lang="ts">
const open = ref(true);

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
</script>

<template>
  <BaseModal
    v-model:open="open"
    :logo="false"
    banner="top"
    banner-top="/assets/images/banners/cancel_registration.jpg"
  >
    <div class="flex flex-col items-center gap-2">
      <h1 class="text-2xl font-semibold text-center">
        {{ $t("modal_cancel_registration.headline") }}
      </h1>

      <div class="text-emphasis text-center">
        {{ $t("modal_cancel_registration.body") }}
      </div>

      <BaseButton
        size="xl"
        class="mt-4 w-full gap-1.5"
      >
        <span>{{ $t("button.continue") }}</span>
        <BaseIcon
          name="lucide:arrow-right"
          :size="20"
        />
      </BaseButton>

      <BaseButton
        variant="ghost"
        size="ghost"
        class="mt-6 text-center text-sm text-subtle hover:text-subtle-light"
      >
        {{ $t("modal_cancel_registration.cancel") }}
      </BaseButton>
    </div>
  </BaseModal>
</template>
