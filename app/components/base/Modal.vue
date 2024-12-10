<script setup lang="ts">
// DESIGN STATUS: ✴️
//   * close button ideally should float and not scroll
//   * if a banner is present (left or top) we need to show bg on close thats semi-transparent black
//   * the flexbox on this could probably be improved... its sort of close however. top/none work fine, but "left" is kind of a doozie
// ARCHITECTURE STATUS: ✴️
//   * I want banner/bannerLeft/bannerTop to be properly validated by typescript
// TRANSLATION STATUS:  ✅

const props = withDefaults(
  defineProps<{
    open: boolean;
    disabled?: boolean;
    unclosable?: boolean;
    logo?: boolean;
    banner?: "none" | "top" | "left";
    bannerLeft?: string;
    bannerTop?: string;
  }>(),
  {
    loading: false,
    banner: "none",
    logo: true,
    unclosable: false,
  },
);

const emit = defineEmits<{
  (e: "update:open", value: boolean): void;
  (e: "close"): void;
}>();

const open = computed({
  get: () => props.open,
  set: (value: boolean) => emit("update:open", value),
});

const preloadBannerLinks = (() => {
  const links = [];
  if (props.bannerLeft) {
    links.push({ rel: "preload", href: props.bannerLeft, as: "image" as const });
  }
  if (props.bannerTop) {
    links.push({ rel: "preload", href: props.bannerTop, as: "image" as const });
  }
  return links;
})();

if (preloadBannerLinks.length > 0) {
  useHead(() => ({ link: preloadBannerLinks }));
}
</script>

<template>
  <BaseDialog
    v-model:open="open"
    v-bind="$attrs"
    :disabled="disabled"
    :unclosable="unclosable"
    :class="cn(
      'p-0',
      { 'lg:max-w-max': banner === 'left' }, // for lg screensize with left banner, let content size handle the width
    )"
    @close="emit('close')"
  >
    <div
      v-if="banner === 'none'"
      class="pt-10 flex flex-col"
    >
      <div
        v-if="logo"
        class="logo"
      >
        <IconLogo />
      </div>

      <div class="content-padding">
        <slot />
      </div>
    </div>

    <div
      v-else-if="banner === 'top'"
      class="flex flex-col"
    >
      <NuxtImg
        v-if="bannerTop"
        :src="bannerTop"
        class="banner-top"
        :class="{ 'mb-8': logo }"
      />

      <div
        v-if="logo"
        class="logo"
      >
        <IconLogo />
      </div>

      <div class="content-padding">
        <slot />
      </div>
    </div>

    <div
      v-else-if="banner === 'left'"
      class="flex flex-row"
    >
      <!-- hardcode a px value here that mostly works with all "left" size modals -->
      <div class="w-[300px] hidden lg:block flex-shrink">
        <NuxtImg
          v-if="bannerLeft"
          :src="bannerLeft"
          class="h-full object-cover sm:rounded-l-lg"
        />
      </div>

      <div class="flex flex-col lg:pt-10 lg:min-w-[var(--giro-modal-default-max-width)]">
        <NuxtImg
          v-if="bannerTop"
          :src="bannerTop"
          :class="cn(
            'banner-top lg:hidden',
            { 'mb-8': logo },
          )"
        />

        <div
          v-if="logo"
          class="logo"
        >
          <IconLogo />
        </div>

        <div class="content-padding">
          <slot />
        </div>
      </div>
    </div>
  </BaseDialog>
</template>

<style scoped>
.logo {
  @apply mb-3 w-[9rem] self-center;
}
.banner-top {
  @apply w-full aspect-[100/37] object-cover sm:rounded-t-lg;
}
.content-padding {
  @apply p-5;
}
</style>
