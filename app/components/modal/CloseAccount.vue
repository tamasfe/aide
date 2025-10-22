<script setup lang="ts">
const nuxtApp = useNuxtApp();
const open = ref(false);

useRuntimeHook("frontend:command:modal:close-account:open", () => {
  open.value = true;
});

useRuntimeHook("frontend:command:modal:close-account:close", () => {
  open.value = false;
});

useRuntimeHook("frontend:command:modal:close", () => {
  open.value = false;
});

watch(open, (newValue) => {
  if (newValue) {
    nuxtApp.callHook("frontend:event:modal:close-account:opened");
  }
  else {
    nuxtApp.callHook("frontend:event:modal:close-account:closed");
  }
});
</script>

<template>
  <BaseModal
    id="base-modal-close-account"
    v-model:open="open"
    :logo="false"
  >
    <template #title>
      {{ $t("modal_close_account.title") }}
    </template>

    <p class="mb-4 text-emphasis">
      {{ $t("modal_close_account.alternative_cool_off") }}
    </p>
    <p class="mb-4 text-emphasis">
      {{ $t("modal_close_account.help_us_improve") }}
    </p>
    <FormCloseAccount />
  </BaseModal>
</template>
