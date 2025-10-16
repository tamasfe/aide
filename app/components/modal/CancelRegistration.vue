<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
const { $dependencies } = useNuxtApp();

defineProps<{
  open: boolean;
}>();

const siteStore = useSiteStore();

const onClosed = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <BaseModal
    :open="open"
    :logo="false"
    banner="top"
    :banner-top="siteStore.getRelativeAssetPath('banners/cancel_registration.jpg')"
    @update:open="v => !v && onClosed()"
  >
    <template #title>
      {{ $t("modal_cancel_registration.title") }}
    </template>
    <div class="flex flex-col items-center gap-2">
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
        class="mt-6 text-center text-sm text-subtle md:hover:text-subtle-light"
      >
        {{ $t("modal_cancel_registration.cancel") }}
      </BaseButton>
    </div>
  </BaseModal>
</template>
