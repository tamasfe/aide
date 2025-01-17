<script setup lang="ts">
const open = ref(true);

defineProps({});

const { $dependencies } = useNuxtApp();

const onClosed = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <BaseModal
    id="base-modal-close-account"
    v-model:open="open"
    :logo="false"
    @close="onClosed"
  >
    <template #title>
      {{ $t("modal_close_account.title") }}
    </template>

    <p class="mb-4 text-emphasis">{{ $t("modal_close_account.alternative_cool_off") }}</p>
    <p class="mb-4 text-emphasis">{{ $t("modal_close_account.help_us_improve") }}</p>
    <FormCloseAccount />
  </BaseModal>
</template>
