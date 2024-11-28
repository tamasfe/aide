<script setup lang="ts">
const open = ref(true);

defineProps({
  token: {
    type: String,
    required: true,
  },
});

const { $dependencies } = useNuxtApp();
const onClosed = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <BaseModal
    id="base-modal-recover-password"
    v-model:open="open"
    banner="left"
    banner-left="/assets/images/login_vertical.jpg"
    banner-top="/assets/images/login_horizontal.jpg"
    @close="onClosed"
  >
    <FormRecoverPassword :token="token" />
  </BaseModal>
</template>
