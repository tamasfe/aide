<template>
  <div class="header__wrapper flex flex-col items-center w-full fixed bg-black top-0 left-0 z-[998]">
    <!-- <div class="relative w-full p-3 bg-[#A38BD7] text-white text-center">
      Refer a friend and earn <strong>R$ 5,00</strong> of REAL balance for each friend you invite 💥
    </div> -->
    <div class="flex place-content-between w-full max-w-[1296px] py-[9px] px-[32px] items-center">
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
const store = useTriggersStore()

const openAuthModal = (type:string = 'register') => {
  store.setAuthModalType(type)
  store.setAuthModalState(true)
}
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
