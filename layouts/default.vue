<script setup lang="ts">
import { Button, Input, GridPage, Notice } from "#components";

const modalsOpen = reactive<any>({
  modal1: false,
  modal2: false,
  modal3: false,
  modal4: false,
});

const toggleModal = (key: any) => {
  modalsOpen[key] = !modalsOpen[key];
};

const name = ref("John Doe");
const refferalNoticeOpen = ref(true);
</script>

<template>
  <div>
    <Transition name="slide">
      <Notice
        v-if="refferalNoticeOpen"
        class="w-full"
        variant="info"
        @close="() => (refferalNoticeOpen = false)"
      >
        Refer a friend and earn R$ 5,00 of REAL balance for each friend you
        invite
      </Notice>
    </Transition>
    <TestModal v-model:opened="modalsOpen.modal1" size="lg" slide-out-left />
    <TestModal v-model:opened="modalsOpen.modal2" size="sm" slide-out-right />
    <TestModal v-model:opened="modalsOpen.modal3" size="xl" />
    <TestModal v-model:opened="modalsOpen.modal4" size="xl" center />
    <div class="p-6 flex flex-col sm:flex-row items-center gap-4 bg-subtle">
      <Select
        v-model="name"
        wrapper-class="bg-emphasis"
        input-class="placeholder:text-subtle"
        title="Name"
        placeholder="Enter your name"
        error="You cannot do that sir"
        :options="[
          {
            title: 'John Doe',
            value: 'John Doe',
          },
          {
            title: 'Jane Doe',
            value: 'Jane Doe',
          },
          {
            title: 'John Smith',
            value: 'John Smith',
          },
        ]"
      >
      </Select>
      <Input
        v-model="name"
        wrapper-class="bg-emphasis"
        input-class="placeholder:text-subtle"
        title="Name"
        placeholder="Enter your name"
      >
        <template #prefix>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-[24px] w-[24px] text-subtle"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-5.2-5.2"
            />
            <circle cx="10" cy="10" r="8" />
          </svg>
        </template>
      </Input>
      <Button variant="primary" @click="toggleModal('modal1')">Primary</Button>
      <Button variant="secondary" @click="toggleModal('modal2')"
        >Secondary</Button
      >
      <Button variant="emphasis" @click="toggleModal('modal3')"
        >Emphasis</Button
      >
    </div>
    <div class="p-6 flex flex-col sm:flex-row items-center gap-4 bg-subtle">
      <Button variant="primary" big shadow border @click="toggleModal('modal4')"
        >START</Button
      >
      <Button variant="secondary" big>SOMETHING </Button>
      <Button variant="emphasis" big shadow border>DEPOSIT</Button>
    </div>
    <div class="grid grid-cols-1 gap-4 p-6">
      <GridPage
        :data="['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']"
        :columns="6"
      >
        <template #title> ⭐ Popular </template>
        <template #options>
          <Button class="bg-subtle text-subtle"> See all </Button>
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
          <Button class="bg-subtle text-subtle"> See all </Button>
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
    <!-- PUblic mobile sticky footer -->
    <div
      class="block sm:hidden sticky bottom-0 left-0 w-full bg-subtle text-subtle"
    >
      <div
        class="flex items-center justify-between p-4 text-emphasis font-semibold"
      >
        <div class="flex-1">Menu</div>
        <div class="flex-1">Hot</div>
        <div class="flex-1">Search</div>
        <div class="flex-1">Support</div>
        <div class="flex-1">Promos</div>
      </div>
    </div>
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
