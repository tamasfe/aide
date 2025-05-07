<script setup lang="ts">
import { destructureGameIdentifier } from "~/modules/games/domain/Game";

defineProps<{
  identifier: string;
}>();
</script>

<template>
  <BaseLink :to="{ name: 'games-provider-game', params: { provider: destructureGameIdentifier(identifier).providerSlug, game: destructureGameIdentifier(identifier).gameSlug } }">
    <slot />
  </BaseLink>
</template>
