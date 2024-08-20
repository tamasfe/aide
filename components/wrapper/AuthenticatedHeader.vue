<script setup lang="ts">
import { PhCircleNotch, PhList, PhUser } from "@phosphor-icons/vue";
import { toggleSidebarSymbol } from "~/constants";
import { getCurrencySymbol, formatNumber } from "~/utils/index";
import { useBalance } from "~/composables/useBalance";

const { t } = useI18n();

const { data: balance, refresh, status } = await useBalance();
const data = computed(() => {
  if (balance.value && balance.value.length) {
    return balance.value[0];
  }
  return null;
});
const balanceValue = computed(() => {
  if (data.value) {
    const value = parseFloat(data.value.balance);
    return formatNumber(value, {
      locale: locale.value,
      decimalPlaces: 2,
    });
  }
  return "";
});

// TODO: hardcoded for now, is it fetched from the user settings? ( language )
const locale = ref("pt-BR");

const currencySymbol = computed(() => {
  if (data.value) {
    return getCurrencySymbol(data.value.currency);
  }
  return "";
});

// deposti modal
const depositModalOpened = ref(false);

const loading = computed(() => status.value === "pending");

// TODO: check where balance is stored
// not sure if funcionality is working yet
const onClickBalance = () => {
  refresh();
};

const onClickDeposit = () => {
  depositModalOpened.value = true;
};

const toggleSidebar = inject(toggleSidebarSymbol);

const onClickMenu = () => {
  if (toggleSidebar) {
    toggleSidebar();
  }
};
</script>

<template>
  <div class="w-full bg-subtle">
    <ModalDeposit v-model:opened="depositModalOpened" />
    <div
      class="giro__container flex items-center justify-between py-[0.525rem] sm:py-2"
    >
      <div class="flex items-center gap-x-8">
        <button
          type="button"
          class="hidden sm:block outline-none"
          @click="onClickMenu"
        >
          <PhList
            class="text-subtle"
            :size="30"
          />
        </button>
        <NuxtLink
          to="/"
          class="min-w-8 sm:min-w-[8.5rem]"
        >
          <IconsLogoSmall class="sm:hidden" />
          <IconsLogo class="hidden sm:block" />
        </NuxtLink>
      </div>
      <div class="flex items-center space-x-[0.625rem] sm:space-x-4">
        <BaseButton
          variant="secondary"
          class="py-2 sm:py-2.5 inline-flex giro__button-balance"
          type="button"
          @click="onClickBalance"
        >
          <div v-if="loading">
            <PhCircleNotch
              :size="18"
              class="text-default animate-spin"
            />
          </div>
          <p class="bg-button-primary text-transparent bg-clip-text">
            {{ currencySymbol }}
          </p>
          <p class="text-white">
            {{ balanceValue }}
          </p>
        </BaseButton>
        <BaseButton
          class="py-2 sm:py-2.5"
          variant="emphasis"
          type="button"
          @click="onClickDeposit"
        >
          {{ t("payment_flow.deposit") }}
        </BaseButton>
        <NuxtLink class="text-subtle hover:text-emphasis cursor-pointer">
          <span class="block">
            <PhUser :size="20" />
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
