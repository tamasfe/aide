<template>
  <div class="w-full flex flex-col justify-center items-center py-20 md:py-6 px-8 md:px-16">
    <h1 class="text-white text-center font-montserrat font-medium text-2xl mb-3">
      Are you sure you want to cancel your registration?
    </h1>
    <p class="text-white text-center font-montserrat font-normal text-sm mb-8">
      Cadastre-se e deposite agora e ganhe o dobro do seu depósito até R$ 7.000
    </p>

    <PartialsButtonComponent variant="solid" big class="w-full mb-2" :color="'secondary'" @click="onContinue()">
      CONTINUE
    </PartialsButtonComponent>
    <PartialsButtonComponent variant="text" big class="w-full font-normal" :color="'secondary'" @click="onCancel()">
      Yes, i want to cancel
    </PartialsButtonComponent>
  </div>
</template>

<script setup lang="ts">
const store = useTriggersStore();

const onContinue = () => {
  store.setAuthModalType('register');
  store.setCloseOutsideState(false);
}

const onCancel = () => {
  store.setAuthModalState(false);
  store.setCloseOutsideState(true);
}
</script>