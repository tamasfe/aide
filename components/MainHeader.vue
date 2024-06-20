<script setup lang="ts">
const refferalBaseNoticeOpen = ref(true);

const modalLoginRegisterOpened = ref(false);
const type = ref<"login" | "register">("login");

const login = () => {
  type.value = "login";
  modalLoginRegisterOpened.value = true;
};

const register = () => {
  type.value = "register";
  modalLoginRegisterOpened.value = true;
};

const changeType = (newType: "login" | "register") => {
  type.value = newType;
};
</script>

<template>
  <div class="sticky top-0 left-0 w-full z-[10]">
    <ModalLoginRegister
      v-model:opened="modalLoginRegisterOpened"
      :type="type"
      @request:login="changeType('login')"
      @request:register="changeType('register')"
    />
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
      <IconsLogo />
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
  </div>
</template>
