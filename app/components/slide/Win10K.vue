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
      :src="siteStore.getAssetPath('images/slides/win-10k.jpg')"
      alt=""
      class="rounded-sm md:rounded-lg object-cover object-center w-full h-full"
    />
  </button>
</template>
