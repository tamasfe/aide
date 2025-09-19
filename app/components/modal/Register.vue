<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const props = defineProps<{
  open: boolean;
}>();

const siteStore = useSiteStore();
const { $dependencies } = useNuxtApp();

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
const { data: currentStartedSignupFlow, refresh } = await useAsyncData(`current-signup-flow`, async () => {
  return $dependencies.signupFlows.ui.searchCurrentSignupFlowOnModalInit.handle();
}, { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING });

// Refresh the signup flow initial data when modal closes, for next time it opens
watch(() => props.open, async (isOpen) => {
  if (!isOpen) {
    await refresh();
  }
});

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
