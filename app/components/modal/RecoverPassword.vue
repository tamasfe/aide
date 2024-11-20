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
    banner-left="/assets/images/wheel-2-vertical.png"
    banner-top="/assets/images/wheel-2.png"
    @close="onClosed"
  >
    <FormRecoverPassword :token="token" />
  </BaseModal>
</template>
