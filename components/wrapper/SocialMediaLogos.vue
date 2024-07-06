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
    <h3 class="text-lg text-emphasis font-semibold hidden md:block">
      Social Media
    </h3>
    <div class="flex space-x-2 lg:space-x-4 justify-evenly md:justify-start">
      <div class="p-1 lg:p-3 rounded-xl hover:bg-emphasis">
        <NuxtLink to="/telegram">
          <PhTelegramLogo :size="28" />
        </NuxtLink>
      </div>
      <div class="p-1 lg:p-3 rounded-xl hover:bg-emphasis">
        <NuxtLink to="/instagram">
          <PhInstagramLogo :size="28" />
        </NuxtLink>
      </div>
      <div class="p-1 lg:p-3 rounded-xl hover:bg-emphasis">
        <NuxtLink to="/x">
          <PhXLogo :size="28" />
        </NuxtLink>
      </div>
      <div class="p-1 lg:p-3 rounded-xl hover:bg-emphasis">
        <NuxtLink to="/tiktok">
          <PhTiktokLogo :size="28" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
