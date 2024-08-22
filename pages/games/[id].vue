<script setup lang="ts">
</script>

<template>
  <div
    class="max-w-full sm:px-4 xl:py-8 xl:max-w-[1240px] mx-auto flex flex-col space-y-4 md:space-y-8"
  >
    <GameFrame
      v-if="!isMobile"
    />
    <GameFrameMobile v-else />
    <GameDescriptionCard class="bg-subtle" />
    <div class="giro__container w-full flex flex-col space-y-4 md:space-y-8">
      <WrapperGameScroll
        v-for="category in data"
        :key="category.id"
      />
      <WrapperProviderScroll title="🏆 Providers" />
    </div>
  </div>
</template>
