<script setup lang="ts">
import {
  openLoginModalSymbol,
  openRegisterModalSymbol,
  openSidebarSymbol,
  toggleSidebarSymbol,
} from "./constants";
import type { RegisterCredentialsBrazil } from "./types/auth";

const { currentRoute, push: routerPush } = useRouter();
const { isAuthenticated, login: loginUser } = useAuth();

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

const onSuccessLogin = () => {
  modalLoginRegisterOpened.value = false;
  modalCancelRegistrationOpened.value = false;
  isAuthenticated.value = true;
  routerPush({ query: {} });
};

// TODO: addiotional functionality like toast required
const onSuccessRegister = async (credentials: RegisterCredentialsBrazil) => {
  const success = await loginUser({
    username: credentials.email,
    password: credentials.password,
  });
  if (success) {
    onSuccessLogin();
    return;
  }
  routerPush({
    path: "/",
    query: {
      login: "true",
    },
  });
};

// TODO: put log/reg modal in entrypoint component and
// interact with it through a global event
watch(
  currentRoute,
  (route) => {
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
      @success:login="onSuccessLogin"
      @success:register="onSuccessRegister"
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
