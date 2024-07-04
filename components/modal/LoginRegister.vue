<script setup lang="ts">
const emit = defineEmits([
  "update:opened",
  "request:login",
  "request:register",
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
</script>

<template>
  <ModalWrapperHorizontal v-model:opened="opened">
    <div class="inline-flex justify-center py-6 sm:pt-12 sm:pb-4">
      <IconsLogo class="w-40" />
    </div>
    <div class="flex-1 px-6 sm:py-6">
      <FormRegisterBrazil
        v-if="type === 'register'"
        @request:login="requestLogin"
      />
      <FormLogin
        v-else-if="type === 'login'"
        @request:register="requestRegister"
      />
    </div>
  </ModalWrapperHorizontal>
</template>
