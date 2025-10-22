<script setup lang="ts">
const nuxtApp = useNuxtApp();
const open = ref(false);

useRuntimeHook("frontend:command:modal:forgot-password:open", () => {
  open.value = true;
});

useRuntimeHook("frontend:command:modal:forgot-password:close", () => {
  open.value = false;
});

useRuntimeHook("frontend:command:modal:close", () => {
  open.value = false;
});

watch(open, (newValue) => {
  if (newValue) {
    nuxtApp.callHook("frontend:event:modal:forgot-password:opened");
  }
  else {
    nuxtApp.callHook("frontend:event:modal:forgot-password:closed");
  }
});
</script>

<template>
  <BaseModal
    v-model:open="open"
    banner="none"
  >
    <FormForgotPassword
      @submitted="() => open=false"
    />
  </BaseModal>
</template>
