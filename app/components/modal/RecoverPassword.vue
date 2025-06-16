<script setup lang="ts">
defineProps<{
  open: boolean;
  token: string;
}>();

const siteStore = useSiteStore();

const { $dependencies } = useNuxtApp();
const onClosed = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <BaseModal
    id="base-modal-recover-password"
    :open="open"
    banner="left"
    :banner-left="siteStore.getCdnAssetPath('banners/login_vertical.jpg')"
    :banner-top="siteStore.getCdnAssetPath('banners/login_horizontal.jpg')"
    @close="onClosed"
  >
    <FormRecoverPassword :token="token" />
  </BaseModal>
</template>
