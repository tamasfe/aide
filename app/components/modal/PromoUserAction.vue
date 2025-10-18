<script setup lang="ts">
defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const userModule = useUserModule();
const userStore = useUserStore();

const onClosed = () => {
  userModule.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <BaseModal
    id="base-modal-promo-user-action"
    class="mx-4 h-auto flex flex-col items-stretch justify-center"
    :open="open"
    :logo="true"
    @update:open="v => !v && onClosed()"
  >
    <i18n-t keypath="modal_promo_user_action.message" tag="p" class="text-emphasis text-center whitespace-pre-line">
      <template #depositAmount>
        <BaseCurrency class="inline" :currency="'BRL'" :value="50" />
      </template>
      <template #winAmount>
        <BaseCurrency class="inline" :currency="'BRL'" :value="1000" />
      </template>
    </i18n-t>

    <div class="mt-10 flex items-center justify-between gap-x-6">
      <template v-if="userStore.user">
        <BaseButton
          variant="secondary"
          class="w-full"
          @click="onClosed"
        >
          {{ $t("button.close") }}
        </BaseButton>
        <BaseButton
          variant="primary"
          class="w-full"
          @click="userModule.ui.emitCommandOpenUserActionModal.handle('deposit')"
        >
          {{ $t("button.deposit") }}
        </BaseButton>
      </template>
      <template v-else>
        <BaseButton
          variant="secondary"
          class="w-full"
          @click="userModule.ui.emitCommandOpenUserActionModal.handle('login')"
        >
          {{ $t("button.login") }}
        </BaseButton>
        <BaseButton
          variant="primary"
          class="w-full ml-3"
          @click="userModule.ui.emitCommandOpenUserActionModal.handle('register')"
        >
          {{ $t("button.register") }}
        </BaseButton>
      </template>
    </div>
  </BaseModal>
</template>
