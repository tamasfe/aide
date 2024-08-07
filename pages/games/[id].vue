<script setup lang="ts">
const { isMobile } = useDevice();

// TODO: maybe use event bus to reuse the same modal?

const modalLoginRegisterOpened = ref(false);
const modalCancelRegistrationOpened = ref(false);
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

const confirmCancelRegistration = () => {
  if (type.value === "register") {
    modalCancelRegistrationOpened.value = true;
  }
};

const continueRegistration = () => {
  modalCancelRegistrationOpened.value = false;
  modalLoginRegisterOpened.value = true;
};
</script>

<template>
  <div
    class="max-w-full sm:px-4 xl:py-8 xl:max-w-[1240px] mx-auto flex flex-col space-y-4 md:space-y-8"
  >
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
    <GameFrame
      v-if="!isMobile"
      @click:login="login"
      @click:register="register"
    />
    <GameFrameMobile v-else />
    <GameDescriptionCard class="bg-subtle" />
    <div class="giro__container w-full flex flex-col space-y-4 md:space-y-8">
      <GameCategory title="🔥 Hot games today" />
      <GameCategory title="👍 Popular games" />
      <ProviderCategory title="🏆 Providers" />
    </div>
  </div>
</template>
