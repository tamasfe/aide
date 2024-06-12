<script setup lang="ts">
import { BaseButton, GridPage, MainHeader, MenuMobile } from "#components";

const modalsOpen = reactive<any>({
  modal1: false,
  modal2: false,
  modal3: false,
  modal4: false,
});

const toggleModal = (key: any) => {
  modalsOpen[key] = !modalsOpen[key];
};
</script>

<template>
  <div>
    <MainHeader />
    <TestModal v-model:opened="modalsOpen.modal1" size="lg" slide-out-left />
    <TestModal v-model:opened="modalsOpen.modal2" size="sm" slide-out-right />
    <TestModal v-model:opened="modalsOpen.modal3" size="xl" />
    <TestModal v-model:opened="modalsOpen.modal4" size="xl" center />
    <div class="p-6 flex flex-col items-center gap-4 bg-subtle">
      <SimpleForm />
      <BaseButton variant="primary" @click="toggleModal('modal1')"
        >Primary</BaseButton
      >
      <BaseButton variant="secondary" @click="toggleModal('modal2')"
        >Secondary</BaseButton
      >
      <BaseButton variant="emphasis" @click="toggleModal('modal3')"
        >Emphasis</BaseButton
      >
    </div>
    <div class="p-6 flex flex-col sm:flex-row items-center gap-4 bg-subtle">
      <BaseButton
        variant="primary"
        big
        shadow
        border
        @click="toggleModal('modal4')"
        >START</BaseButton
      >
      <BaseButton variant="secondary" big>SOMETHING </BaseButton>
      <BaseButton variant="emphasis" big shadow border>DEPOSIT</BaseButton>
    </div>
    <div class="grid grid-cols-1 gap-4 p-6">
      <GridPage
        :data="['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']"
        :columns="6"
      >
        <template #title> ⭐ Popular </template>
        <template #options>
          <BaseButton class="bg-subtle text-subtle"> See all </BaseButton>
        </template>
        <template #default>
          <div class="bg-subtle rounded-default h-[300px] overflow-hidden">
            <img
              src="https://picsum.photos/200/300"
              alt=""
              class="w-full h-full object-cover rounded-default transition-transform transform hover:scale-105"
            />
          </div>
        </template>
      </GridPage>
      <GridPage
        :data="['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']"
        :columns="6"
      >
        <template #title> 🔥 Hot games today </template>
        <template #options>
          <BaseButton class="bg-subtle text-subtle"> See all </BaseButton>
        </template>
        <template #default>
          <div class="bg-subtle rounded-default h-[300px] overflow-hidden">
            <img
              src="https://picsum.photos/200/300"
              alt=""
              class="w-full h-full object-cover rounded-default transition-transform transform hover:scale-105"
            />
          </div>
        </template>
      </GridPage>
    </div>
    <slot />
    <MenuMobile />
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
}

.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
}
</style>
