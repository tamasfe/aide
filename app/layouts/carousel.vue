<script setup lang="ts">
const userStore = useUserStore();

const showFormWelcome = computed(() => userStore.isAuthenticated !== true);
</script>

<template>
  <div class="md:py-8">
    <div class="mb-[var(--giro-section-gap)]">
      <div v-if="showFormWelcome" class="w-full space-y-7 md:space-y-0 md:grid md:grid-cols-3">
        <CarouselHero class="md:col-span-2" />
        <FormWelcome />
      </div>
      <CarouselHero v-else />
    </div>

    <slot />
  </div>
</template>
