<script setup lang="ts">
import type { NuxtLinkProps } from "nuxt/app";
import type { SupportedLocale } from "~/packages/translation";

// Type definition taken from the NuxtLinkLocale.d.ts
type NuxtLinkLocaleProps = Omit<NuxtLinkProps, "to"> & {
  to?: import("vue-router").RouteLocationNamedI18n;
  locale?: SupportedLocale;
};

/**
 * Adding undefineds as defaults to remove vue warns
 */
const props = withDefaults(defineProps<NuxtLinkLocaleProps>(), {
  noPrefetch: undefined,
  prefetch: undefined,
  rel: undefined,
  noRel: undefined,
});
</script>

<template>
  <NuxtLinkLocale v-bind="props">
    <slot />
  </NuxtLinkLocale>
</template>
