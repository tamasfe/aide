<script setup lang="ts">
const search = ref("");
const data = ref([]);
</script>

<template>
  <div class="sm:py-8">
    <div class="max-w-full sm:px-4 xl:p-0 xl:max-w-[1240px] mx-auto">
      <CarouselHero />
    </div>
    <div class="giro__container py-6">
      <div class="flex flex-col gap-8">
        <Search
          v-model="search"
          class="w-full"
        >
          <template #default>
            <WrapperScrollerGame />
          </template>
        </Search>

        <WinningNow />

        <WrapperScrollerGame />
        <WrapperScrollerGame />
        <WrapperScrollerGame />

        <WrapperScrollerProvider title="🏆 Providers" />
      </div>
    </div>
  </div>
</template>
