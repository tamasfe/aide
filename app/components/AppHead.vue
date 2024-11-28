<script setup lang="ts">
const i18nHead = useLocaleHead({
  seo: {},
});
const { locale, baseUrl, defaultLocale } = useI18n();

const alternateLinks = computed(() => {
  if (!i18nHead.value.link) {
    return [];
  }

  return i18nHead.value.link
    .filter(link => link.rel === "alternate")
    .map((link) => {
      if (!link.hreflang) return link;
      if (link.hreflang === "x-default" || link.hreflang === defaultLocale || link.hreflang.split("-")[0] === defaultLocale.split("-")[0]) {
        return {
          ...link,
          href: link.href.replace(baseUrl.value, baseUrl.value + `/${defaultLocale}`),
        };
      }
      return link;
    });
});

const canonicalLink = computed(() => {
  if (!i18nHead.value.link) {
    return null;
  }

  const canonicalLink = i18nHead.value.link.find(link => link.rel === "canonical");
  if (!canonicalLink || locale.value !== defaultLocale) {
    return null;
  }
  return {
    ...canonicalLink,
    href: canonicalLink.href.replace(baseUrl.value, baseUrl.value + `/${defaultLocale}`),
  };
});

useHead(() => ({
  htmlAttrs: {
    lang: i18nHead.value.htmlAttrs!.lang,
  },
  link: [
    ...alternateLinks.value,
    ...(canonicalLink.value ? [canonicalLink.value] : []),
  ],
  meta: [...(i18nHead.value.meta || [])],
}));
</script>

<template>
  <Head />
</template>
