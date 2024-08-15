<script setup lang="ts">
import type { RouteLocationNormalizedLoadedGeneric } from "vue-router";
import {
  openLoginModalSymbol,
  openRegisterModalSymbol,
  openSidebarSymbol,
  toggleSidebarSymbol,
} from "./constants";

const router = useRouter();
const { isAuthenticated } = useAuth();

const modalLoginRegisterOpened = ref(false);
const modalCancelRegistrationOpened = ref(false);
const type = ref<"login" | "register">("login");
const sidebarOpened = ref(false);

// TODO: provide these symbols in a global event
const openSidebar = () => {
  sidebarOpened.value = true;
};

const toggleSidebar = () => {
  sidebarOpened.value = !sidebarOpened.value;
};

const login = () => {
  type.value = "login";
  modalLoginRegisterOpened.value = true;
};

const register = () => {
  type.value = "register";
  modalLoginRegisterOpened.value = true;
};

provide(openLoginModalSymbol, login);
provide(openRegisterModalSymbol, register);
provide(openSidebarSymbol, openSidebar);
provide(toggleSidebarSymbol, toggleSidebar);

const changeType = (newType: "login" | "register") => {
  type.value = newType;
};

const confirmCancelRegistration = () => {
  if (type.value === "register") {
    modalCancelRegistrationOpened.value = true;
  }
};

const continueRegistration = () => {
  modalCancelRegistrationOpened.value = false;
  modalLoginRegisterOpened.value = true;
};

const onSuccessAuth = () => {
  modalLoginRegisterOpened.value = false;
  modalCancelRegistrationOpened.value = false;
  isAuthenticated.value = true;
  router.push({ query: {} });
};

const promptAuth = (route: RouteLocationNormalizedLoadedGeneric) => {
  const query = route.query;
  if (isAuthenticated.value) {
    return;
  }
  if (query.register === "true") {
    type.value = "register";
    modalLoginRegisterOpened.value = true;
    return;
  }
  if (query.login === "true") {
    type.value = "login";
    modalLoginRegisterOpened.value = true;
  }
};

watch(
  router.currentRoute,
  (route) => {
    promptAuth(route);
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>

<template>
  <div>
    <WrapperSidebarMenu v-model:opened="sidebarOpened" />
    <ModalLoginRegister
      v-model:opened="modalLoginRegisterOpened"
      :type="type"
      @request:login="changeType('login')"
      @request:register="changeType('register')"
      @close="confirmCancelRegistration"
      @success:login="onSuccessAuth"
      @success:register="onSuccessAuth"
    />
    <ModalCancelRegistration
      v-model:opened="modalCancelRegistrationOpened"
      @submit="continueRegistration"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
