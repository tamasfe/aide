<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const props = withDefaults(
  defineProps<{
    open: boolean;
    disabled?: boolean;
    banner?: "none" | "top" | "left";
    logo?: boolean;
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
        src="/assets/images/wheel-2.png"
        alt=""
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
      <div class="w-[40%] hidden sm:block">
        <NuxtImg
          src="/assets/images/wheel-2-vertical.png"
          alt="Wheel"
          class="banner-left"
        />
      </div>

      <div class="flex flex-col w-full sm:pt-10">
        <NuxtImg
          src="/assets/images/wheel-2.png"
          alt=""
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
