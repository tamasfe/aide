<script setup lang="ts">
import { destructureGameIdentifier } from "~/modules/games/domain/Game";

const props = defineProps<{
  identifier: string;
}>();

const result = destructureGameIdentifier(props.identifier);
</script>

<template>
  <BaseLink
    v-if="result.isFailure"
    :to="`/games/${props.identifier}`"
  >
    <slot />
  </BaseLink>

  <BaseLink
    v-else
    :to="{ name: 'games-provider-game', params: { provider: result.value.providerSlug, game: result.value.gameSlug } }"
  >
    <slot />
  </BaseLink>
</template>
