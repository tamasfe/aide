<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
defineProps<{
  open: boolean;
}>();

const loading = ref(false);
const siteStore = useSiteStore();
const userModule = useUserModule();

const onClosed = () => {
  userModule.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <BaseModal
    id="base-modal-login"
    :open="open"
    :disabled="loading"
    banner="left"
    :banner-left="siteStore.getRelativeAssetPath('banners/login_vertical.png')"
    :banner-top="siteStore.getRelativeAssetPath('banners/login_horizontal.png')"
    @update:open="v => !v && onClosed()"
  >
    <FormLogin />
  </BaseModal>
</template>
