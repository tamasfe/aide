<script setup lang="ts">
import type { RegisterCredentialsBrazil } from "~/types/auth";

const emit = defineEmits([
  "update:opened",
  "request:login",
  "request:register",
  "success:login",
  "success:register",
  "close",
]);

const props = defineProps<{
  opened: boolean;
  type: "login" | "register";
}>();

const opened = computed({
  get: () => props.opened,
  set: (value: boolean) => {
    emit("update:opened", value);
    if (!value) {
      emit("close");
    }
  },
});

const requestLogin = () => {
  emit("request:login");
};

const requestRegister = () => {
  emit("request:register");
};

const onSuccessfulLogin = () => {
  emit("success:login");
};

const onSuccessfulRegister = (credentials: RegisterCredentialsBrazil) => {
  emit("success:register", credentials);
};
</script>

<template>
  <ModalWrapper
    v-model:opened="opened"
    :close-on-click-outside="false"
    banner="top"
  >
    <div class="inline-flex justify-center py-6 sm:pt-12 sm:pb-4">
      <div class="min-w-36 sm:min-w-40">
        <IconsLogo />
      </div>
    </div>
    <div class="flex-1 px-6 sm:py-6">
      <FormRegisterBrazil
        v-if="type === 'register'"
        @request:login="requestLogin"
        @success="onSuccessfulRegister"
      />
      <FormLogin
        v-else-if="type === 'login'"
        @request:register="requestRegister"
        @success="onSuccessfulLogin"
      />
    </div>
  </ModalWrapper>
</template>
