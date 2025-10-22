<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

defineProps<{
  title: string;
  version?: string;
  date?: string;
  showPrintButton?: boolean;
}>();

const onClickPrintButton = () => {
  window.print();
};
</script>

<template>
  <section class="px-6 py-8 text-base md:text-lg max-w-[850px] mx-auto flex flex-col gap-8 md:gap-12 bg-subtle rounded-lg border border-muted/5">
    <h1 class="text-3xl font-semibold text-white">
      {{ title }}
    </h1>

    <div v-if="version || date || showPrintButton" class="md:flex md:items-start md:justify-between space-y-4 md:space-y-0">
      <div class="space-y-1 text-lg">
        <div v-if="version">
          <span class="text-emphasis font-medium">{{ $t('legal.version') }}:</span> {{ version }}
        </div>
        <div v-if="date">
          <span class="text-emphasis font-medium">{{ $t('legal.updated') }}:</span> {{ date }}
        </div>
      </div>
      <div v-if="showPrintButton" class="print:hidden">
        <BaseButton variant="secondary" @click="onClickPrintButton">
          {{ $t("button.print") }}
        </BaseButton>
      </div>
    </div>

    <div class="app-page-content text-subtle leading-6 md:leading-7">
      <slot />
    </div>
  </section>
</template>

<style scoped>
:deep(.app-page-content) {
  h1 {
    @apply text-3xl font-bold text-emphasis;
  }
  h1:first-of-type {
    @apply mb-12;
  }
  h1:not(:first-of-type) {
    @apply my-12;
  }

  h2 {
    @apply text-2xl font-bold text-emphasis;
  }
  h2:first-of-type {
    @apply mb-10;
  }
  h2:not(:first-of-type) {
    @apply my-10;
  }

  h3 {
    @apply my-8 text-xl font-semibold text-emphasis;
  }

  h4 {
    @apply my-6 text-lg font-semibold text-emphasis;
  }

  ul {
    @apply my-6 list-disc;
  }
  ol {
    @apply my-6 list-decimal;
  }
  li {
    @apply ml-8 pl-2;
  }

  p {
    @apply my-4;
  }
  strong {
    @apply font-semibold;
  }
  a {
    @apply text-emphasis md:hover:underline;
  }
}
</style>
