<script setup lang="ts"></script>

<template>
  <div>
    <AppHeader />

    <div class="sm:py-8">
      <slot />
    </div>

    <AppFooter />

    <NavMobile />
  </div>
</template>
