<script setup lang="ts">
const userStore = useUserStore();

const showFormWelcome = computed(() => userStore.isAuthenticated !== true);
</script>

<template>
  <div class="md:py-8">
    <div class="giro__container-full-width mb-[var(--giro-section-gap)] md:px-4">
      <div v-if="showFormWelcome" class="w-full md:grid md:grid-cols-3 space-y-[var(--giro-section-gap)] md:space-y-0">
        <CarouselHero class="md:col-span-2" />
        <FormWelcome />
      </div>
      <CarouselHero v-else />
    </div>

    <slot />
  </div>
</template>
