<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

defineProps<{
  open: boolean;
}>();

const siteStore = useSiteStore();
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
    banner="left"
    :banner-left="siteStore.getRelativeAssetPath('banners/register_vertical.png')"
    :banner-top="siteStore.getRelativeAssetPath('banners/register_horizontal.png')"
    @update:open="v => !v && onClosed()"
  >
    <FormRegister
      :email="currentStartedSignupFlow?.email || ''"
      :cpf="currentStartedSignupFlow?.cpf || ''"
      :telephone="currentStartedSignupFlow?.telephone || ''"
    />
  </BaseModal>
</template>
