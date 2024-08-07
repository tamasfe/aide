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
      class="!text-base !font-normal text-emphasis !py-4 !px-10"
      :class="active ? 'bg-[#272646]' : 'bg-[#181732]'"
    >
      <slot />
    </BaseButton>
  </NuxtLink>
</template>
