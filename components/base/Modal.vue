<script setup lang="ts">
// DESIGN STATUS: ✴️
//   * close button ideally should float and not scroll
//   * if a banner is present (left or top) we need to show bg on close thats semi-transparent black
//   * the flexbox on this could probably be improved... its sort of close however. top/none work fine, but "left" is kind of a doozie
//   * while not a dealbreaker, there is some weirdness with the width of the left banner still shrinking instead of changing the modal height... maybe this ends up being fine though, im undecided which way
// ARCHITECTURE STATUS: ✴️
//   * I want banner/bannerLeft/bannerTop to be properly validated by typescript
// TRANSLATION STATUS:  ✅

const props = withDefaults(
  defineProps<{
    open: boolean;
    disabled?: boolean;
    logo?: boolean;
    banner?: "none" | "top" | "left";
    bannerLeft?: string;
    bannerTop?: string;
  }>(),
  {
    loading: false,
    banner: "none",
    logo: true,
  },
);

const emit = defineEmits(["update:open", "close"]);

const open = computed({
  get: () => props.open,
  set: (value: boolean) => emit("update:open", value),
});
</script>

<template>
  <BaseDialog
    v-model:open="open"
    v-bind="$attrs"
    :disabled="disabled"
    :class="cn(
      'p-0',
      { 'lg:w-auto lg:max-w-full': banner === 'left' }, // for lg screensize with left banner, we let the outer modal be very large and let the right-hand content column take over managing the width
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
      <div class="w-[40%] hidden lg:block flex-shrink-0">
        <NuxtImg
          v-if="bannerLeft"
          :src="bannerLeft"
          class="banner-left"
        />
      </div>

      <!-- on large screen sizes this is a hardcoded width as max-width does not work with the parent w-auto. given that banner=left components are rare and they will 100% of the time display a form with a fixed width (the one specified below) this is no issue -->
      <div class="flex flex-col w-full lg:pt-10 lg:w-[var(--giro-modal-default-max-width)]">
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
.banner-left {
  @apply h-full object-cover sm:rounded-l-lg;
}
.content-padding {
  @apply p-5;
}
</style>
