<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const { $dependencies } = useNuxtApp();

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
const { data: currentStartedSignupFlow } = await useAsyncData(`current-signup-flow`, async () => {
  return $dependencies.signupFlows.ui.searchCurrentSignupFlowOnModal.handle();
}, { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING });

const onClosed = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <BaseModal
    :open="open"
    :close-on-click-outside="false"
    banner="left"
    banner-left="/assets/images/register_vertical.jpg"
    banner-top="/assets/images/register_horizontal.jpg"
    @close="onClosed"
  >
    <FormRegister
      :email="currentStartedSignupFlow?.email || ''"
      :cpf="currentStartedSignupFlow?.cpf || ''"
      :telephone="currentStartedSignupFlow?.telephone || ''"
    />
  </BaseModal>
</template>
