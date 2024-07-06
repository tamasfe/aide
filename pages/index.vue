<script setup lang="ts">
const search = ref("");
</script>

<template>
  <div class="sm:py-8">
    <div class="max-w-full sm:px-4 xl:p-0 xl:max-w-[1240px] mx-auto">
      <CarouselHome class="w-full" />
    </div>
    <div class="giro__container py-6">
      <div class="grid grid-cols-1 gap-8">
        <BaseSearch
          v-model="search"
          class="w-full"
        >
          <template #default>
            <GameCategory title="🔥 Top Games" />
          </template>
        </BaseSearch>
        <HomeWinningNow class="w-full" />
        <GameCategory title="🔥 Top Games" />
        <GameCategory title="👍 Popular games" />
        <GameCategory title="🚀 Exclusive Games" />
        <GameCategory title="🏆 Trending Games" />
        <ProviderCategory title="🏆 Providers" />
      </div>
    </div>
  </div>
</template>
