<script setup lang="ts">
const { t } = useI18n();

const imageSrc = "/assets/images/wheel-2.png";

const depositModalOpened = ref(false);

const openModal = () => {
  depositModalOpened.value = true;
};
</script>

<template>
  <div class="relative w-full rounded-default pb-[33.33%]">
    <ModalDeposit v-model:opened="depositModalOpened" />
    <NuxtImg
      :src="imageSrc"
      alt="Wheel Spin"
      class="absolute left-0 inset-0 object-cover w-full rounded-default"
    />
    <div
      class="absolute top-1/2 -translate-y-1/2 left-6 sm:left-28 text-lg md:text-2xl lg:text-4xl font-black italic md:leading-6 lg:leading-10 md:space-y-2 lg:space-y-4 select-none"
    >
      <h3
        class="bg-button-primary text-transparent bg-clip-text text-sm md:text-lg lg:text-2xl font-bold"
      >
        EXCLUSIVE
      </h3>
      <h1 class="text-xl md:text-3xl lg:text-5xl">
        PRE-RELEASE
      </h1>
      <h2>
        <span class="bg-button-primary text-transparent bg-clip-text">+100</span>
        FREE SPINS
      </h2>
      <BaseButton
        class="hidden md:inline-flex justify-center cursor-pointer !py-3 !rounded-[0.4rem] leading-6"
        variant="emphasis"
        big
        shadow
        @click="openModal"
      >
        TRY IT NOW
      </BaseButton>
    </div>
  </div>
</template>
