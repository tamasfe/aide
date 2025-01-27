<script setup lang="ts">
import { DialogTitle } from "@headlessui/vue";

// DESIGN STATUS: ✴️
//   * close button ideally should float and not scroll
//   * if a banner is present (left or top) we need to show bg on close thats semi-transparent black
//   * the flexbox on this could probably be improved... its sort of close however. top/none work fine, but "left" is kind of a doozie
// ARCHITECTURE STATUS: ✴️
//   * I want banner/bannerLeft/bannerTop to be properly validated by typescript
// TRANSLATION STATUS:  ✅

const getImageSrc = useImage(); // More info @https://image.nuxt.com/usage/use-image

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
    links.push({ rel: "preload", fetchPriority: "low", href: getImageSrc(props.bannerLeft), src: getImageSrc(props.bannerLeft), as: "image" as const, crossOrigin: "anonymous" });
  }
  if (props.bannerTop) {
    links.push({ rel: "preload", fetchPriority: "low", href: getImageSrc(props.bannerTop), src: getImageSrc(props.bannerTop), as: "image" as const, crossOrigin: "anonymous" });
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
    :class="cn(
      'p-0',
      { 'lg:max-w-max': banner === 'left' }, // for lg screensize with left banner, let content size handle the width
    )"
    @close="emit('close')"
  >
    <template #default="{ close }">
      <div
        v-if="banner !== 'left'"
        class="h-14 flex justify-end px-5 items-center"
        :class="{
          'absolute top-0 left-0 right-0': banner !== 'none',
        }"
      >
        <div v-if="banner === 'none'" class="flex-1">
          <DialogTitle is="h2" v-if="$slots.title" class="text-xl leading-snug">
            <slot name="title" />
          </DialogTitle>
          <h3 v-if="$slots.subtitle" class="text-subtle text-sm leading-snug"><slot name="subtitle" /></h3>
        </div>
        <BaseClose
          v-if="!unclosable"
          class="-mr-5"
          :disabled="disabled"
          @close="() => close(true)"
        />
      </div>

      <div
        v-if="banner === 'none'"
        class="flex flex-col"
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
          <DialogTitle is="h2" v-if="$slots.title" class="text-xl leading-snug">
            <slot name="title" />
          </DialogTitle>
          <h3 v-if="$slots.subtitle" class="text-subtle text-sm leading-snug"><slot name="subtitle" /></h3>
          <section
            :class="{
              'pt-4': $slots.title || $slots.subtitle,
            }"
          >
            <slot />
          </section>
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
            class="h-full object-cover"
          />
        </div>

        <div class="flex flex-col lg:min-w-[var(--giro-modal-default-max-width)]">
          <NuxtImg
            v-if="bannerTop"
            :src="bannerTop"
            :class="cn(
              'banner-top lg:hidden',
              { 'mb-2': logo },
            )"
          />

          <div
            class="h-14 flex justify-end px-5 items-center"
          >
            <div class="flex-1">
              <DialogTitle is="h2" v-if="$slots.title" class="text-xl leading-snug">
                <slot name="title" />
              </DialogTitle>
              <h3 v-if="$slots.subtitle" class="text-subtle text-sm leading-snug"><slot name="subtitle" /></h3>
            </div>
            <BaseClose
              v-if="!unclosable"
              class="-mr-5"
              :disabled="disabled"
              @close="() => close(true)"
            />
          </div>

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
    </template>
  </BaseDialog>
</template>

<style scoped>
.logo {
  @apply mb-3 w-[9rem] self-center;
}
.banner-top {
  @apply w-full aspect-[100/37] object-cover;
}
.content-padding {
  @apply p-5;
}
</style>
