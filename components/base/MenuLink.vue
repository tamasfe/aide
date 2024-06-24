<script setup lang="ts">
type MenuLinkProps = {
  title: string;
  value: string;
  icon?: Component;
  iconClass?: string;
};

defineProps<MenuLinkProps>();
</script>

<template>
  <NuxtLink
    class="flex items-center gap-2"
    :to="value"
  >
    <Component
      :is="icon"
      v-if="icon"
      :size="24"
      :class="iconClass"
    />
    <p>{{ title }}</p>
  </NuxtLink>
</template>
