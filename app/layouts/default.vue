<script setup lang="ts"></script>

<template>
  <div>
    <AppHeader />

    <div class="md:pt-8">
      <slot />
    </div>

    <AppFooter />

    <NavMobile />
  </div>
</template>
