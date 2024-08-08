<script setup lang="ts">
defineProps<{
  to: {
    name: string;
  };
  active?: boolean;
}>();
</script>

<template>
  <NuxtLink :to="to">
    <BaseButton
      type="button"
      class="!text-base !font-medium text-emphasis !py-4 !px-10"
      :class="
        active ? 'text-emphasis bg-[#272646]' : 'text-subtle bg-[#181732]'
      "
    >
      <slot />
    </BaseButton>
  </NuxtLink>
</template>
