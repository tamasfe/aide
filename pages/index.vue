<script setup lang="ts">
const search = ref("");
const person = ref();
const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);
</script>

<template>
  <div>
    <div class="p-6 flex flex-col items-center gap-4 bg-subtle">
      <SimpleForm />
    </div>
    <ComponentsTest />
    <div class="grid grid-cols-1 gap-4 p-6">
      <BaseSearch
        v-model="search"
        class="w-full"
      >
        <template #default>
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
                  :src="`https://picsum.photos/200/300?random=${random(0, 100)}`"
                  alt=""
                  class="w-full h-full object-cover rounded-default transition-transform transform hover:scale-105"
                >
              </div>
            </template>
          </GridPage>
        </template>
      </BaseSearch>
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
              :src="`https://picsum.photos/200/300?random=${random(0, 100)}`"
              alt=""
              class="w-full h-full object-cover rounded-default transition-transform transform hover:scale-105"
            >
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
              :src="`https://picsum.photos/200/300?random=${random(0, 100)}`"
              alt=""
              class="w-full h-full object-cover rounded-default transition-transform transform hover:scale-105"
            >
          </div>
        </template>
      </GridPage>
    </div>
  </div>
</template>
