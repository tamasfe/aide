<script setup lang="ts">
import {
  PhInstagramLogo,
  PhTelegramLogo,
  PhTiktokLogo,
  PhXLogo,
} from "@phosphor-icons/vue";
</script>

<template>
  <div class="flex flex-col space-y-4">
    <h3 class="text-lg text-emphasis font-semibold hidden lg:block">
      Social Media
    </h3>
    <div class="flex space-x-4 justify-evenly lg:justify-start">
      <NuxtLink to="/terms">
        <PhTelegramLogo :size="24" />
      </NuxtLink>
      <NuxtLink to="/privacy">
        <PhInstagramLogo :size="24" />
      </NuxtLink>
      <NuxtLink to="/responsible">
        <PhXLogo :size="24" />
      </NuxtLink>
      <NuxtLink to="/cookies">
        <PhTiktokLogo :size="24" />
      </NuxtLink>
    </div>
  </div>
</template>
