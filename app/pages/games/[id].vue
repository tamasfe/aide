<script setup lang="ts">
const { isMobile } = useDevice();
</script>

<template>
  <div class="giro__container">
    <div class="giro__section">
      <GameFrameMobile v-if="isMobile" />
      <GameFrame v-else />
    </div>

    <div class="giro__section">
      <GameDescriptionCard class="bg-subtle" />
    </div>

    <div class=".giro__section">
      <WrapperScrollerGame />
    </div>
  </div>
</template>
