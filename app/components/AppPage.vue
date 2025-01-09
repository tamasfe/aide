<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

defineProps<{
  title: string;
  version?: string;
  date?: string;
}>();
</script>

<template>
  <section class="py-8">
    <DashboardSection class="text-base md:text-lg px-4 pb-14 max-w-[850px] mx-auto">
      <template #title>
        <h1 class="text-3xl font-semibold text-white">{{ title }}</h1>
      </template>

      <div
        v-if="version || date"
        class="mb-8 text-lg space-y-1"
      >
        <div v-if="version"><span class="text-emphasis font-medium">{{ $t('legal.version') }}:</span> {{ version }}</div>
        <div v-if="date"><span class="text-emphasis font-medium">{{ $t('legal.updated') }}:</span> {{ date }}</div>
      </div>

      <div class="text-subtle leading-6 md:leading-7">
        <slot />
      </div>
    </DashboardSection>
  </section>
</template>

<style scoped>
:deep(p) {
  @apply my-4;
}
:deep(strong) {
  @apply font-semibold;
}
:deep(a) {
  @apply text-emphasis hover:underline;
}
:deep(h4) {
  @apply my-6 text-lg font-semibold text-emphasis;
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
