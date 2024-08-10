<script setup lang="ts">
const emit = defineEmits([
  "update:opened",
  "request:login",
  "request:register",
  "success:login",
  "success:register",
  "close",
]);

type ModalType = "login" | "register";
const props = defineProps<{
  opened: boolean;
  type: ModalType;
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
</script>

<template>
  <ModalWrapperHorizontal
    v-model:opened="opened"
    :close-on-click-outside="false"
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
      />
      <FormLogin
        v-else-if="type === 'login'"
        @request:register="requestRegister"
        @success="onSuccessfulLogin"
      />
    </div>
  </ModalWrapperHorizontal>
</template>
