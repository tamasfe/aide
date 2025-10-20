<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";

const userModule = useUserModule();
const userStore = useUserStore();
const gameSessionStore = useGameSessionStore();
const nuxtApp = useNuxtApp();

const open = ref(false);

const onClosed = () => {
  userModule.ui.emitCommandCloseUserActionModal.handle();
};

const lastOpened = useLocalStorage<Date>("promo_last_opened", new Date(0));

const SECONDS_TO_AUTO_OPEN_PROMO_MODAL = 10;

nuxtApp.hook("frontend:command:modal:promo:open", () => {
  open.value = true;
});

nuxtApp.hook("frontend:command:modal:promo:close", () => {
  open.value = false;
});

nuxtApp.hook("frontend:command:modal:close", () => {
  open.value = false;
});

function isSameDay(first: Date, second: Date): boolean {
  return Math.abs(first.getTime() - second.getTime()) < 24 * 60 * 60 * 1000;
}

onMounted(() => {
  const interval = setInterval(() => {
    if (!gameSessionStore.playing && !isSameDay(lastOpened.value, new Date())) {
      open.value = true;
      lastOpened.value = new Date();
      clearInterval(interval);
    }
  }, SECONDS_TO_AUTO_OPEN_PROMO_MODAL * 1000);
});
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
