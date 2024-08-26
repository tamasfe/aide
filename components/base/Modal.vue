<script setup lang="ts">
// DESIGN STATUS: ✴️
//   * TODO: the modal needs to be scrollable but currently isnt
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
    class="p-0"
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
      <div class="w-[40%] hidden sm:block flex-shrink-0">
        <NuxtImg
          v-if="bannerLeft"
          :src="bannerLeft"
          class="banner-left"
        />
      </div>

      <div class="flex flex-col w-full sm:pt-10">
        <NuxtImg
          v-if="bannerTop"
          :src="bannerTop"
          class="banner-top sm:hidden"
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
    </div>
  </BaseDialog>
</template>

<style scoped>
.logo {
  @apply w-[9rem] self-center;
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
