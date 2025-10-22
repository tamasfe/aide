<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";

const userStore = useUserStore();
const gameSessionStore = useGameSessionStore();
const nuxtApp = useNuxtApp();
const open = ref(false);

const lastOpened = useLocalStorage<Date>("promo_last_opened", new Date(0));

const SECONDS_TO_AUTO_OPEN_PROMO_MODAL = 10;

useRuntimeHook("frontend:command:modal:promo:open", () => {
  open.value = true;
});

useRuntimeHook("frontend:command:modal:promo:close", () => {
  open.value = false;
});

useRuntimeHook("frontend:command:modal:close", () => {
  open.value = false;
});

watch(open, (newValue) => {
  if (newValue) {
    nuxtApp.callHook("frontend:event:modal:promo:opened");
  }
  else {
    nuxtApp.callHook("frontend:event:modal:promo:closed");
  }
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
    v-model:open="open"
    class="mx-4 h-auto flex flex-col items-stretch justify-center"
    :logo="true"
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
          @click="open = false"
        >
          {{ $t("button.close") }}
        </BaseButton>
        <BaseButton
          variant="primary"
          class="w-full"
          @click="nuxtApp.callHook('frontend:command:modal:deposit:open')"
        >
          {{ $t("button.deposit") }}
        </BaseButton>
      </template>
      <template v-else>
        <BaseButton
          variant="secondary"
          class="w-full"
          @click="nuxtApp.callHook('frontend:command:modal:login:open')"
        >
          {{ $t("button.login") }}
        </BaseButton>
        <BaseButton
          variant="primary"
          class="w-full ml-3"
          @click="nuxtApp.callHook('frontend:command:modal:register:open')"
        >
          {{ $t("button.register") }}
        </BaseButton>
      </template>
    </div>
  </BaseModal>
</template>
