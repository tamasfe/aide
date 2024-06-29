<script setup lang="ts">
const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const data = ref([
  { name: "John Doe", age: 30 },
  { name: "Jane Doe", age: 25 },
  { name: "John Doe", age: 30 },
  { name: "Jim Doe", age: 40 },
  { name: "John Doe", age: 30 },
  { name: "John Doe", age: 30 },
  { name: "John Doe", age: 30 },
  { name: "Jane Doe", age: 25 },
  { name: "Jim Doe", age: 40 },
  { name: "Jane Doe", age: 25 },
  { name: "John Doe", age: 30 },
  { name: "John Doe", age: 30 },
  { name: "Jim Doe", age: 40 },
  { name: "Jane Doe", age: 25 },
  { name: "Jim Doe", age: 40 },
  { name: "Jane Doe", age: 25 },
  { name: "Jim Doe", age: 40 },
  { name: "Jane Doe", age: 25 },
  { name: "Jim Doe", age: 40 },
  { name: "Jane Doe", age: 25 },
  { name: "Jim Doe", age: 40 },
]);
</script>

<template>
  <div class="sm:py-8 w-full">
    <div class="sm:px-10 h-[200px] sm:h-[350px] lg:h-[450px]">
      <CarouselHome class="h-full w-full" />
    </div>
    <div class="px-4 sm:px-10 py-6">
      <BaseGrid
        class="w-full"
        :data="data"
      >
        <template>
          <div>
            <NuxtImg
              :src="`https://picsum.photos/200/300?random=${random(0, 100)}`"
              alt=""
              class="w-full h-full rounded-default transition-transform transform hover:scale-105"
            />
          </div>
        </template>
      </BaseGrid>
    </div>
  </div>
</template>
