<template>
  <div class="header__wrapper flex flex-col items-center w-full fixed bg-black top-0 left-0 z-[998]">
    <NotificationsHeaderNotification />
    <div class="flex place-content-between w-full max-w-[1296px] py-[9px] px-4 md:px-[32px] items-center h-[52px]">
      <div class="flex">
        <img
          src="/girobet-logo.svg"
          alt="Girobet logo"
        >
      </div>
      <div
        v-if="authStore.getAuthorizationState"
        class="hidden md:flex flex-1 mx-6"
      >
        <GlobalSearchBar
          v-model="search"
          class="w-full max-w-[369px]"
        />
      </div>
      <div class="flex gap-x-4">
        <PartialsButtonComponent
          variant="text"
          @click="store.setSideMenuType('menu'); store.setSideMenuState(true)"
        >
          MENU
        </PartialsButtonComponent>
        <PartialsButtonComponent
          v-if="authStore.getAuthorizationState"
          variant="square"
        >
          <img
            src="/icons/notification.svg"
            class="w-5 h-5"
          >
        </PartialsButtonComponent>
        <PartialsButtonComponent
          v-if="authStore.getAuthorizationState"
          variant="square"
        >
          <img
            src="/icons/profile.svg"
            class="w-5 h-5"
          >
        </PartialsButtonComponent>
        <PartialsButtonComponent
          v-if="authStore.getAuthorizationState"
          variant="solid"
          :color="'secondary'"
        >
          DEPOSIT
        </PartialsButtonComponent>
        <PartialsButtonComponent
          v-if="!authStore.getAuthorizationState"
          variant="text"
          :label="'LOG IN'"
          @click="openAuthModal('login')"
        >
          LOG IN
        </PartialsButtonComponent>
        <PartialsButtonComponent
          v-if="!authStore.getAuthorizationState"
          variant="solid"
          :color="'secondary'"
          @click="openAuthModal('register')"
        >
          REGISTER
        </PartialsButtonComponent>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useTriggersStore();
const authStore = useAuthStore();

const search = ref("");

const openAuthModal = (type: string = "register") => {
  store.setAuthModalType(type);
  store.setAuthModalState(true);
};
</script>

<style scoped>
.header__wrapper::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 1px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.15);
}
</style>
