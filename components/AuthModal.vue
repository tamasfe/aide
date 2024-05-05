<template>
  <Transition>
    <div
      v-if="store.getAuthModalOpen"
      class="flex justify-center items-center fixed left-0 top-0 size-full z-[999]"
    >
      <div
        class="absolute left-0 top-0 size-full bg-black opacity-90 z-[-1]"
        @click="store.getCloseOutsideState ? closeModal() : true"
      ></div>
      <div class="relative w-full h-full md:h-auto md:max-w-[552px] rounded-xl bg-auth-modal-bg">
        <div class="w-full relative">
          <img v-if="store.getAuthModalType !== 'cancelRegistration'" src="~/assets/images/placeholders/auth-banner.png">
          <div
            class="flex items-center justify-center absolute right-6 top-6 size-[32px] rounded bg-auth-modal-close-button bg-opacity-40 hover:bg-opacity-100 cursor-pointer"
            @click="closeModal()"
          >
            <img src="~/assets/images/icons/cross.svg">
          </div>
        </div>
        
        <ModalAuthModalRegistrationForm v-if="store.getAuthModalType === 'register'" />
        <ModalAuthModalLoginForm v-else-if="store.getAuthModalType === 'login'" />
        <ModalCancelRegistration v-else-if="store.getAuthModalType === 'cancelRegistration'"/>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const store = useTriggersStore();

const closeModal = () => {
  if(store.getAuthModalType === 'register') {
    store.setAuthModalType('cancelRegistration')
    store.setCloseOutsideState(true);
  } else {
    store.setAuthModalState(false);
    store.setCloseOutsideState(true);
  }
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.35s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(0px);
}
</style>
