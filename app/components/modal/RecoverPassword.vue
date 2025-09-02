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
    :banner-left="siteStore.getRelativeAssetPath('banners/login_vertical.png')"
    :banner-top="siteStore.getRelativeAssetPath('banners/login_horizontal.png')"
    @close="onClosed"
  >
    <FormRecoverPassword :token="token" />
  </BaseModal>
</template>
