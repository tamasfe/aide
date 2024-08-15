<script setup lang="ts">
import { PhCircleNotch, PhList, PhUser } from "@phosphor-icons/vue";
import { toggleSidebarSymbol } from "~/constants";
import { getCurrencySymbol, formatNumber } from "~/utils/index";

const { t } = useI18n();

// TODO: load from user/settings store
const locale = ref("pt-BR");
const currencySymbol = getCurrencySymbol("BRL");

// deposti modal
const depositModalOpened = ref(false);

const loading = ref(false);

// TODO: add functionality
const onClickBalance = () => {
  // faking fetching of the data
  if (loading.value) {
    return;
  }
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
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
      class="giro__container flex items-center justify-between py-[0.6rem] sm:py-3"
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
          class="min-w-8 sm:min-w-40"
        >
          <IconsLogoSmall class="sm:hidden" />
          <IconsLogo class="hidden sm:block" />
        </NuxtLink>
      </div>
      <div class="flex items-center space-x-3 sm:space-x-4">
        <BaseButton
          variant="secondary"
          class="py-2 inline-flex giro__button-balance"
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
            {{
              formatNumber(2349.34, {
                locale: locale,
                decimalPlaces: 2,
              })
            }}
          </p>
        </BaseButton>
        <BaseButton
          class="py-2"
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
