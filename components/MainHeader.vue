<script setup lang="ts">
import { PhList } from "@phosphor-icons/vue";
import { openLoginModalSymbol, openRegisterModalSymbol } from "~/constants";

const { t } = useI18n();

const refferalBaseNoticeOpen = ref(true);

const sidebarOpened = ref(false);

const openSidebar = () => {
  sidebarOpened.value = true;
};

const toggleSidebar = () => {
  sidebarOpened.value = !sidebarOpened.value;
};

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

defineExpose({
  openSidebar,
  toggleSidebar,
});
</script>

<template>
  <nav class="sticky top-0 left-0 w-full z-[9]">
    <SidebarMenu v-model:opened="sidebarOpened" />
    <Transition name="slide">
      <BaseNotice
        v-if="refferalBaseNoticeOpen"
        class="w-full h-14"
        variant="info"
        @close="() => (refferalBaseNoticeOpen = false)"
      >
        <p class="text-center">
          {{ t("refer_a_friend") }}
        </p>
      </BaseNotice>
    </Transition>
    <div class="w-full bg-subtle">
      <div
        class="giro__container flex items-center justify-between py-[0.6rem] sm:py-3"
      >
        <div class="flex items-center gap-x-8">
          <button
            type="button"
            class="hidden sm:block outline-none"
            @click="openSidebar"
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
  </nav>
</template>
