<script setup>
const triggerError = () => {
  throw new Error("[TESTING ALERTS] Nuxt Button Error");
};
</script>

<template>
  <section class="w-full h-96 flex items-center justify-center">
    <BaseButton id="errorBtn" @click="triggerError">
      Trigger Error
    </BaseButton>
  </section>
</template>
