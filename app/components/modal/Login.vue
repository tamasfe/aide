<script setup lang="ts">
const nuxtApp = useNuxtApp();
const siteStore = useSiteStore();
const open = ref(false);

useRuntimeHook("frontend:command:modal:login:open", () => {
  open.value = true;
});

useRuntimeHook("frontend:command:modal:login:close", () => {
  open.value = false;
});

useRuntimeHook("frontend:command:modal:close", () => {
  open.value = false;
});

watch(open, (newValue) => {
  if (newValue) {
    nuxtApp.callHook("frontend:event:modal:login:opened");
  }
  else {
    nuxtApp.callHook("frontend:event:modal:login:closed");
  }
});
</script>

<template>
  <BaseModal
    id="base-modal-login"
    v-model:open="open"
    banner="left"
    :banner-left="siteStore.getRelativeAssetPath('banners/login_vertical.png')"
    :banner-top="siteStore.getRelativeAssetPath('banners/login_horizontal.png')"
  >
    <FormLogin />
  </BaseModal>
</template>
