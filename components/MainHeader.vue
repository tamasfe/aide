<script setup lang="ts">
import { PhList } from "@phosphor-icons/vue";

const { query } = useRoute();

const { t } = useI18n();

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

const toggleSidebar = () => {
  sidebarOpened.value = !sidebarOpened.value;
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

// TODO: put log/reg modal in entrypoint component and
// interact with it through a global event
if (query.register === "true") {
  type.value = "register";
  modalLoginRegisterOpened.value = true;
}
else if (query.login === "true") {
  type.value = "login";
  modalLoginRegisterOpened.value = true;
}

const onSuccess = () => {
  modalLoginRegisterOpened.value = false;
  navigateTo("/");
};

defineExpose({
  openSidebar,
  toggleSidebar,
});
</script>

<template>
  <nav class="sticky top-0 left-0 w-full z-[9]">
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
      @success:login="onSuccess"
    />
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
            @click="login"
          >
            {{ t("login") }}
          </BaseButton>
          <BaseButton
            class="py-2"
            variant="primary"
            @click="register"
          >
            {{ t("register") }}
          </BaseButton>
        </div>
      </div>
    </div>
  </nav>
</template>
