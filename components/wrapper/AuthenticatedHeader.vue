<script setup lang="ts">
import { PhList, PhUser } from "@phosphor-icons/vue";
import { toggleSidebarSymbol } from "~/constants";

const { t } = useI18n();

// TODO: load from user/settings store
const locale = ref("pt-BR");
const currencySymbol = getCurrencySymbol("BRL");

// TODO: add functionality
const onClickBalance = () => {};
const onClickDeposit = () => {};

const toggleSidebar = inject(toggleSidebarSymbol);

const onClickMenu = () => {
  if (toggleSidebar) {
    toggleSidebar();
  }
};
</script>

<template>
  <div class="w-full bg-subtle">
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
          class="py-2 inline-flex"
          type="button"
          @click="onClickBalance"
        >
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
          {{ t("deposit") }}
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
