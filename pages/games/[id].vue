<script setup lang="ts">
const { isMobile } = useDevice();
</script>

<template>
  <div
    class="max-w-full sm:px-4 xl:py-8 xl:max-w-[1240px] mx-auto flex flex-col space-y-4 md:space-y-8"
  >
    <GameFrameMobile v-if="isMobile" />
    <GameFrame v-else />

    <GameDescriptionCard class="bg-subtle" />

    <div class="giro__container w-full flex flex-col space-y-4 md:space-y-8">
      <WrapperScrollerGame />
    </div>
  </div>
</template>
