<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * locale must be properly handled via props/pinia not as a static variable
// TRANSLATION STATUS:  ✅

const locale = ref("pt-br");

const telegramUrl = computed(() => {
  return "TODO";
});

const instagramUrl = computed(() => {
  if (locale.value === "pt-br") {
    return "https://www.instagram.com/girobetofficial/";
  }
  // eventually default to english
  return "https://www.instagram.com/girobetofficial/";
});

const xUrl = computed(() => {
  if (locale.value === "pt-br") {
    return "https://x.com/girobet";
  }
  // eventually default to english
  return "https://x.com/girobet";
});

const tiktokUrl = computed(() => {
  if (locale.value === "pt-br") {
    return "https://www.tiktok.com/@girobetofficial";
  }
  // eventually default to english
  return "https://www.tiktok.com/@girobetofficial";
});

const links: Array<{ icon: string; url: ComputedRef }> = [
  { icon: "ph:telegram-logo", url: telegramUrl },
  { icon: "ph:instagram-logo", url: instagramUrl },
  { icon: "ph:x-logo", url: xUrl },
  { icon: "ph:tiktok-logo", url: tiktokUrl },
];
</script>

<template>
  <div class="flex flex-col">
    <h3 class="hidden lg:block text-lg text-emphasis font-semibold">
      {{ $t("footer.social_media") }}
    </h3>
    <div
      class="mt-8 md:mt-0 flex space-x-4 lg:space-x-2 justify-evenly md:justify-start"
    >
      <BaseLink
        v-for="(link, index) in links"
        :key="index"
        :to="link.url.value"
        target="_blank"
        rel="noopener noreferrer"
        class="p-1 lg:p-3 rounded hover:text-subtle-light"
      >
        <BaseIcon
          :name="link.icon"
          :size="24"
        />
      </BaseLink>
    </div>
  </div>
</template>
