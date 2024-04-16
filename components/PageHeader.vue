<template>
  <div class="header__wrapper flex flex-col items-center w-full fixed bg-black top-0 left-0 z-[998]">
    <div v-if="store.getPromoNotificationOpen" class="relative flex w-full p-3 bg-[#A38BD7] text-white text-center">
      <span class="flex-1">
        Refer a friend and earn <strong>R$ 5,00</strong> of REAL balance for each friend you invite 💥
      </span>
      <div class="p-1 cursor-pointer" @click="closePromoNotification()">
        <img src="/icons/cross.svg">
      </div>
    </div>
    <div class="flex place-content-between w-full max-w-[1296px] py-[9px] px-4 md:px-[32px] items-center h-[52px]">
      <div>
        <img src="/girobet-logo.svg" alt="Girobet logo">
      </div>
      <div class="flex gap-x-4">
        <PartialsButtonComponent variant="text" :label="'LOG IN'" @click="openAuthModal('login')"/>
        <PartialsButtonComponent variant="solid" :label="'REGISTER'" @click="openAuthModal('register')"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useTriggersStore();

const closePromoNotification = () => {
  store.setPromoNotificationState(false)
};

const openAuthModal = (type:string = 'register') => {
  store.setAuthModalType(type)
  store.setAuthModalState(true)
};
</script>

<style scoped>
.header__wrapper::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 1px;
  width: 100%;
  background-color: rgba(255,255,255, 0.15);
}
</style>
