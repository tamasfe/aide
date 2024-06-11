<script setup lang="ts">
import {
  BaseButton,
  BaseInput,
  GridPage,
  BaseNotice,
  BaseSelect,
} from "#components";

const modalsOpen = reactive<any>({
  modal1: false,
  modal2: false,
  modal3: false,
  modal4: false,
});

const toggleModal = (key: any) => {
  modalsOpen[key] = !modalsOpen[key];
};

const name = ref("10000");
const selectValue = ref<string>();
const refferalBaseNoticeOpen = ref(true);
const wrapper = ref();
</script>

<template>
  <div>
    <div class="sticky top-0 left-0 w-full z-[10]">
      <Transition name="slide">
        <BaseNotice
          v-if="refferalBaseNoticeOpen"
          class="w-full"
          variant="info"
          @close="() => (refferalBaseNoticeOpen = false)"
        >
          Refer a friend and earn R$ 5,00 of REAL balance for each friend you
          invite
        </BaseNotice>
      </Transition>
      <div
        class="bg-subtle flex items-center justify-between px-4 sm:px-10 py-4"
      >
        <IconsLogo />
        <div class="flex items-center gap-4">
          <BaseButton variant="secondary" @click="toggleModal('modal3')"
            >Login</BaseButton
          >
          <BaseButton variant="primary" @click="toggleModal('modal3')"
            >Register</BaseButton
          >
        </div>
      </div>
    </div>
    <TestModal v-model:opened="modalsOpen.modal1" size="lg" slide-out-left />
    <TestModal v-model:opened="modalsOpen.modal2" size="sm" slide-out-right />
    <TestModal v-model:opened="modalsOpen.modal3" size="xl" />
    <TestModal v-model:opened="modalsOpen.modal4" size="xl" center />
    <div class="p-6 flex flex-col items-center gap-4 bg-subtle">
      <BaseInputWrapper ref="wrapper" class="w-full">
        <template #default>
          <div class="bg-emphasis text-subtle">test 123123123123123123123</div>
        </template>
      </BaseInputWrapper>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <BaseSelect
          v-model="selectValue"
          wrapper-class="bg-emphasis"
          input-class="placeholder:text-subtle"
          title="Name"
          placeholder="Enter your name"
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
            {
              title: 'Jane Smith',
              value: 'Jane Smith',
            },
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
            {
              title: 'Jane Smith',
              value: 'Jane Smith',
            },
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
            {
              title: 'Jane Smith',
              value: 'Jane Smith',
            },
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
            {
              title: 'Jane Smith',
              value: 'Jane Smith',
            },
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
            {
              title: 'Jane Smith',
              value: 'Jane Smith',
            },
          ]"
        >
          <template #prefix>
            <IconsRS />
          </template>
        </BaseSelect>
        <BaseInput
          v-model="name"
          wrapper-class="bg-emphasis"
          input-class="text-default text-xl font-bold"
          title="Deposit"
          blurScreen
          scrollIntoView
        >
          <template #prefix>
            <IconsRS />
          </template>
        </BaseInput>
      </div>
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
