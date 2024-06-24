<script setup lang="ts">
const { isMobile } = useDevice();
const imageSrc = isMobile
  ? `/assets/images/wheel.png`
  : `/assets/images/wheel-spin.png`;

const depositModalOpened = ref(false);

const openModal = () => {
  depositModalOpened.value = true;
};
</script>

<template>
  <div class="h-full w-full">
    <ModalDeposit v-model:opened="depositModalOpened" />
    <div
      class="absolute top-1/2 -translate-y-1/2 left-6 sm:left-4 text-lg md:left-28 lg:text-2xl xl:text-4xl font-black italic lg:space-y-4 lg:leading-4 xl:space-y-8 xl:leading-6"
    >
      <h3 class="text-brand-yellow text-sm lg:text-xl xl:text-2xl">
        EXCLUSIVE
      </h3>
      <h1 class="font-extrabold text-xl lg:text-3xl xl:text-5xl">
        PRE-RELEASE
      </h1>
      <h1 class="font-extrabold text-xl lg:text-3xl xl:text-5xl text-nowrap">
        FROM WILDJACK
      </h1>
      <h2 class="font-extrabold">
        <span class="text-brand-yellow">+100</span> FREE SPINS
      </h2>
      <BaseButton
        class="hidden lg:block cursor-pointer"
        variant="emphasis"
        big
        shadow
        @click="openModal"
      >
        TRY IT NOW
      </BaseButton>
    </div>
    <NuxtImg
      :src="imageSrc"
      alt="Wheel Spin"
      class="object-cover h-full w-full rounded-default"
    />
  </div>
</template>
