<script setup lang="ts">
const search = ref("");
</script>

<template>
  <div class="sm:py-8">
    <div class="giro__container-no-padding md:px-[var(--giro-container-padding)]">
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

        <WrapperScrollerProvider />
      </div>
    </div>
  </div>
</template>
