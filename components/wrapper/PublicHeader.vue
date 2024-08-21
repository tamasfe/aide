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
          class="min-w-32 sm:min-w-[8.5rem]"
        >
          <IconsLogo />
        </NuxtLink>
      </div>
      <div class="flex items-center space-x-[0.625rem] sm:space-x-4">
        <BaseButtonNew
          variant="secondary"
          @click="onClickLogin"
        >
          {{ t("button.login") }}
        </BaseButtonNew>
        <BaseButtonNew
          variant="primary"
          @click="onClickRegister"
        >
          {{ t("button.register") }}
        </BaseButtonNew>
      </div>
    </div>
  </div>
</template>
