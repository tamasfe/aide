<script setup lang="ts">
defineProps({
  open: {
    type: Boolean,
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
    id="base-modal-close-account"
    :open="open"
    :logo="false"
    @update:open="v => !v && onClosed()"
  >
    <template #title>
      {{ $t("modal_close_account.title") }}
    </template>

    <p class="mb-4 text-emphasis">{{ $t("modal_close_account.alternative_cool_off") }}</p>
    <p class="mb-4 text-emphasis">{{ $t("modal_close_account.help_us_improve") }}</p>
    <FormCloseAccount />
  </BaseModal>
</template>
