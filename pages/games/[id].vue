<script setup lang="ts">
const { isMobile } = useDevice();
</script>

<template>
  <div class="giro__container sm:py-8 flex flex-col md:space-y-6">
    <!-- h-[520px] -->
    <GameFrame v-if="!isMobile" />
    <GameFrameMobile v-else />
    <GameDescriptionCard class="bg-subtle" />
    <GameCategory title="👍 Hot games today" />
    <GameCategory title="👍 Popular games" />
    <ProviderCategory title="🏆 Providers" />
  </div>
</template>
