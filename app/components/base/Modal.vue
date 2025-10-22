<script setup lang="ts">
import { DialogClose, DialogDescription, DialogTitle } from "reka-ui";
import type { AlertProps } from "./Alert.vue";

const DEFAULT_PX_WIDTH_LEFT_BANNER = 300;
const DEFAULT_PX_WIDTH_TOP_BANNER = 640;

withDefaults(
  defineProps<{
    disabled?: boolean;
    unclosable?: boolean;
    logo?: boolean;
    banner?: "none" | "top" | "left";
    bannerLeft?: string;
    bannerTop?: string;
    alert?: AlertProps;
  }>(),
  {
    loading: false,
    banner: "none",
    logo: true,
    unclosable: false,
  },
);

const open = defineModel<boolean>("open", {
  required: true,
});
</script>

<template>
  <BaseDialog
    v-model:open="open"
    :disabled="disabled"
    :class="cn(
      'p-0',
      { 'lg:max-w-max': banner === 'left' }, // for lg screensize with left banner, let content size handle the width
    )"
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
          <DialogDescription v-if="$slots.subtitle" class="text-subtle text-sm leading-snug">
            <slot name="subtitle" />
          </DialogDescription>
        </div>
        <DialogClose v-if="!unclosable" class="-mr-5 p-3 aspect-square h-full text-subtle md:hover:text-emphasis rounded-lg transition-colors duration-200 focus:outline-none">
          <span class="sr-only">{{ $t('i18n.close') }}</span>
          <div class="aspect-square bg-subtle/80 rounded backdrop-blur h-full flex items-center justify-center">
            <BaseIcon
              name="lucide:x"
              :size="20"
            />
          </div>
        </DialogClose>
      </div>

      <div
        v-if="banner === 'none'"
        class="flex flex-col"
      >
        <div
          v-if="logo"
          class="logo"
        >
          <BrandLogo />
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
          provider="custom_cloudflare"
          format="webp"
          quality="60"
          :sizes="`${DEFAULT_PX_WIDTH_TOP_BANNER}px sm:480px`"
          :class="{ 'mb-8': logo }"
        />

        <div
          v-if="logo"
          class="logo"
        >
          <BrandLogo />
        </div>

        <div class="content-padding">
          <BaseAlert
            v-if="alert"
            class="mb-4"
            v-bind="alert"
          />

          <DialogTitle is="h2" v-if="$slots.title" class="text-xl leading-snug">
            <slot name="title" />
          </DialogTitle>
          <h3 v-if="$slots.subtitle" class="text-subtle text-sm leading-snug">
            <slot name="subtitle" />
          </h3>
          <DialogDescription
            :class="{
              'pt-4': $slots.title || $slots.subtitle,
            }"
          >
            <slot />
          </DialogDescription>
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
            provider="custom_cloudflare"
            format="webp"
            quality="60"
            :sizes="`${DEFAULT_PX_WIDTH_LEFT_BANNER}px`"
            :src="bannerLeft"
            class="h-full object-cover"
          />
        </div>

        <div class="flex flex-col lg:min-w-[var(--giro-modal-default-max-width)]">
          <NuxtImg
            v-if="bannerTop"
            :src="bannerTop"
            provider="custom_cloudflare"
            format="webp"
            quality="60"
            sizes="640px sm:480px"
            :class="cn(
              'banner-top lg:hidden',
              { 'mb-2': logo },
            )"
          />

          <BaseAlert
            v-if="alert"
            class="my-4"
            v-bind="alert"
          />

          <div
            class="h-14 flex justify-end px-5 items-center"
          >
            <div class="flex-1">
              <DialogTitle is="h2" v-if="$slots.title" class="text-xl leading-snug">
                <slot name="title" />
              </DialogTitle>
              <h3 v-if="$slots.subtitle" class="text-subtle text-sm leading-snug">
                <slot name="subtitle" />
              </h3>
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
            <BrandLogo />
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
  @apply mb-3 w-[9rem] lg:w-[10rem] self-center;
}
.banner-top {
  @apply w-full aspect-[100/37] object-cover;
}
.content-padding {
  @apply p-5;
}
</style>
