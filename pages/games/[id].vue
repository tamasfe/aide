<script setup lang="ts">
</script>

<template>
  <div
    class="max-w-full sm:px-4 xl:py-8 xl:max-w-[1240px] mx-auto flex flex-col space-y-4 md:space-y-8"
  >
    <BaseGameFrame
      v-if="!isMobile"
    />
    <BaseGameFrameMobile v-else />

    <BaseGameDescriptionCard class="bg-subtle" />

    <div class="giro__container w-full flex flex-col space-y-4 md:space-y-8">
      <WrapperScrollerGame
        v-for="category in data"
        :key="category.id"
      />
    </div>
  </div>
</template>
