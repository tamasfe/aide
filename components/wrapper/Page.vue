<script setup lang="ts">
const { t } = useI18n();

defineProps<{
  title: string;
  version?: string;
  date?: string;
}>();
</script>

<template>
  <div class="text-base md:text-lg px-4 mt-8 pb-14 max-w-[850px] mx-auto">
    <h1 class="text-3xl mb-6 font-semibold text-white">{{ title }}</h1>

    <div
      v-if="version || date"
      class="mb-8 text-lg space-y-1"
    >
      <div v-if="version"><span class="text-emphasis font-medium">{{ t('metadata.version') }}:</span> {{ version }}</div>
      <div v-if="date"><span class="text-emphasis font-medium">{{ t('metadata.updated') }}:</span> {{ date }}</div>
    </div>

    <div class="text-subtle leading-6 md:leading-7">
      <slot />
    </div>
  </div>
</template>

<style scoped>
:deep(p) {
  @apply my-4;
}
:deep(strong) {
  @apply font-semibold;
}
:deep(h4) {
  @apply my-6 text-[1.2rem] font-semibold text-emphasis;
}
:deep(ul) {
  @apply my-6 list-disc;
}
:deep(ol) {
  @apply my-6 list-decimal;
}
:deep(li) {
  @apply ml-8 pl-2;
}
</style>
