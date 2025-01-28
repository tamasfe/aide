<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
defineProps<{
  open: boolean;
}>();

const loading = ref(false);

const { $dependencies } = useNuxtApp();
const onClosed = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <BaseModal
    id="base-modal-login"
    :open="open"
    :disabled="loading"
    banner="left"
    banner-left="/assets/images/banners/login_vertical.jpg"
    banner-top="/assets/images/banners/login_horizontal.jpg"
    @close="onClosed"
  >
    <FormLogin />
  </BaseModal>
</template>
