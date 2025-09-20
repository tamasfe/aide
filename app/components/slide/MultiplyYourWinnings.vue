<script setup lang="ts">
const siteStore = useSiteStore();
const { $dependencies } = useNuxtApp();
const userStore = useUserStore();

const onSlideClick = () => {
  if (userStore.user) {
    $dependencies.common.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", { modal: "deposit" });
    return;
  }
  $dependencies.common.asyncMessagePublisher.emit("frontend:commands:modals:open-user-interaction-modal", { modal: "login" });
};
</script>

<template>
  <button
    type="button"
    @click="() => onSlideClick()"
  >
    <NuxtImg
      fetchpriority="high"
      preload
      provider="custom_cloudflare"
      sizes="550px md:750px"
      :src="siteStore.getRelativeAssetPath('slides/2.png')"
      alt=""
      class="rounded md:rounded-lg object-cover object-center w-full h-full"
    />
  </button>
</template>
