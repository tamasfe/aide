<script setup lang="ts">
const siteStore = useSiteStore();
const nuxtApp = useNuxtApp();
const open = ref(false);
const signupModule = useSignupModule();

useRuntimeHook("frontend:command:modal:register:open", () => {
  open.value = true;
});

useRuntimeHook("frontend:command:modal:register:close", () => {
  open.value = false;
});

useRuntimeHook("frontend:command:modal:close", () => {
  open.value = false;
});

watch(open, (newValue) => {
  if (newValue) {
    nuxtApp.callHook("frontend:event:modal:register:opened");
  }
  else {
    nuxtApp.callHook("frontend:event:modal:register:closed");
  }
});

const { data: currentStartedSignupFlow } = useAsyncData(`current-signup-flow`, async () => {
  return signupModule.ui.searchCurrentSignupFlowOnModalInit.handle();
}, {
  lazy: true,
  server: false,
});
</script>

<template>
  <BaseModal
    v-model:open="open"
    banner="left"
    :banner-left="siteStore.getRelativeAssetPath('banners/register_vertical.png')"
    :banner-top="siteStore.getRelativeAssetPath('banners/register_horizontal.png')"
  >
    <FormRegister
      :email="currentStartedSignupFlow?.email ?? ''"
      :cpf="currentStartedSignupFlow?.cpf ?? ''"
      :telephone="currentStartedSignupFlow?.telephone ?? ''"
    />
  </BaseModal>
</template>
