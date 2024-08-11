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
            <WrapperGameScroll title="🔥 Top Games" />
          </template>
        </BaseSearch>
        <HomeWinningNow class="w-full" />
        <WrapperGameScroll title="🔥 Top Games" />
        <WrapperGameScroll title="👍 Popular games" />
        <WrapperGameScroll title="🚀 Exclusive Games" />
        <WrapperGameScroll title="🏆 Trending Games" />
        <WrapperProviderScroll title="🏆 Providers" />
      </div>
    </div>
  </div>
</template>
