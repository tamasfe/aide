<script setup lang="ts">
defineProps<{
  open: boolean;
  token: string;
}>();

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
    banner-left="/assets/girobet/images/banners/login_vertical.jpg"
    banner-top="/assets/girobet/images/banners/login_horizontal.jpg"
    @close="onClosed"
  >
    <FormRecoverPassword :token="token" />
  </BaseModal>
</template>
