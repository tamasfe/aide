<script setup lang="ts">
import { openLoginModalSymbol, openRegisterModalSymbol } from "~/constants";
import { useGameCategories } from "~/composables/useGameCategories";

const { isMobile } = useDevice();

const openLoginModal = inject(openLoginModalSymbol);
const openRegisterModal = inject(openRegisterModalSymbol);

const { data: categories } = await useGameCategories("home");

const data = computed(() => {
  return categories.value || [];
});

const onClickLogin = () => {
  if (openLoginModal) {
    openLoginModal();
  }
};
const onClickRegister = () => {
  if (openRegisterModal) {
    openRegisterModal();
  }
};
</script>

<template>
  <div
    class="max-w-full sm:px-4 xl:py-8 xl:max-w-[1240px] mx-auto flex flex-col space-y-4 md:space-y-8"
  >
    <GameFrame
      v-if="!isMobile"
      @click:login="onClickLogin"
      @click:register="onClickRegister"
    />
    <GameFrameMobile v-else />
    <GameDescriptionCard class="bg-subtle" />
    <div class="giro__container w-full flex flex-col space-y-4 md:space-y-8">
      <WrapperGameScroll
        v-for="category in data"
        :key="category.id"
        :identifier="category.identifier"
        :category="category.id"
      />
      <WrapperProviderScroll title="🏆 Providers" />
    </div>
  </div>
</template>
