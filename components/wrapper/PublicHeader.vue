<script setup lang="ts">
import { PhList } from "@phosphor-icons/vue";
import {
  openLoginModalSymbol,
  openRegisterModalSymbol,
  toggleSidebarSymbol,
} from "~/constants";

const { t } = useI18n();

const openLoginModal = inject(openLoginModalSymbol);
const openRegisterModal = inject(openRegisterModalSymbol);

const onClickLogin = () => {
  if (openLoginModal) {
    openLoginModal();
  }
};
const onClickRegister = () => {
  if (openRegisterModal) {
    openRegisterModal();
  }
};

const toggleSidebar = inject(toggleSidebarSymbol);

// TODO: Add openSidebar function
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
          class="min-w-36 sm:min-w-40"
        >
          <IconsLogo />
        </NuxtLink>
      </div>
      <div class="flex items-center space-x-3 sm:space-x-4">
        <BaseButton
          variant="secondary"
          class="py-2"
          type="button"
          @click="onClickLogin"
        >
          {{ t("login") }}
        </BaseButton>
        <BaseButton
          class="py-2"
          variant="primary"
          type="button"
          @click="onClickRegister"
        >
          {{ t("register") }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
