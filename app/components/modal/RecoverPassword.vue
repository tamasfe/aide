<script setup lang="ts">
const siteStore = useSiteStore();
const nuxtApp = useNuxtApp();
const { searchParams } = useRequestURL();
const recoverPasswordToken = useState("user-modal-recover-password-token", () => searchParams.get("recovery-token") || "");
const open = ref(false);

useRuntimeHook("frontend:command:modal:recover-password:open", () => {
  open.value = true;
});

useRuntimeHook("frontend:command:modal:recover-password:close", () => {
  open.value = false;
});

useRuntimeHook("frontend:command:modal:close", () => {
  open.value = false;
});

watch(open, (newValue) => {
  if (newValue) {
    nuxtApp.callHook("frontend:event:modal:recover-password:opened");
  }
  else {
    nuxtApp.callHook("frontend:event:modal:recover-password:closed");
  }
});

onMounted(() => {
  if (recoverPasswordToken.value) {
    open.value = true;
  }
});
</script>

<template>
  <BaseModal
    id="base-modal-recover-password"
    v-model:open="open"
    banner="left"
    :banner-left="siteStore.getRelativeAssetPath('banners/login_vertical.png')"
    :banner-top="siteStore.getRelativeAssetPath('banners/login_horizontal.png')"
  >
    <FormRecoverPassword :token="recoverPasswordToken" />
  </BaseModal>
</template>
