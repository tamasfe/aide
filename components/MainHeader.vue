<script setup lang="ts">
import { PhList } from "@phosphor-icons/vue";

const refferalBaseNoticeOpen = ref(true);

const modalLoginRegisterOpened = ref(false);
const modalCancelRegistrationOpened = ref(false);
const sidebarOpened = ref(false);
const type = ref<"login" | "register">("login");

const login = () => {
  type.value = "login";
  modalLoginRegisterOpened.value = true;
};

const register = (e: Event) => {
  e.preventDefault();
  type.value = "register";
  modalLoginRegisterOpened.value = true;
};

const changeType = (newType: "login" | "register") => {
  type.value = newType;
};

const openSidebar = () => {
  sidebarOpened.value = true;
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

defineExpose({
  openSidebar,
});
</script>

<template>
  <nav class="sticky top-0 left-0 w-full z-[10]">
    <ModalCancelRegistration
      v-model:opened="modalCancelRegistrationOpened"
      @submit="continueRegistration"
    />
    <ModalLoginRegister
      v-model:opened="modalLoginRegisterOpened"
      :type="type"
      @request:login="changeType('login')"
      @request:register="changeType('register')"
      @close="confirmCancelRegistration"
    />
    <SidebarMenu v-model:opened="sidebarOpened" />
    <Transition name="slide">
      <BaseNotice
        v-if="refferalBaseNoticeOpen"
        class="w-full"
        variant="info"
        @close="() => (refferalBaseNoticeOpen = false)"
      >
        Refer a friend and earn R$ 5,00 of REAL balance for each friend you
        invite
      </BaseNotice>
    </Transition>
    <div class="bg-subtle flex items-center justify-between px-4 sm:px-10 py-4">
      <div class="flex items-center space-x-2">
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
        <IconsLogo />
      </div>
      <div class="flex items-center gap-4">
        <BaseButton
          variant="secondary"
          @click="login"
        >
          Login
        </BaseButton>
        <BaseButton
          variant="primary"
          @click="register"
        >
          Register
        </BaseButton>
      </div>
    </div>
  </nav>
</template>
