<script setup lang="ts">
const { t } = useI18n();

const refferalBaseNoticeOpen = ref(true);
const { isAuthenticated } = useAuth();
</script>

<template>
  <nav class="sticky top-0 left-0 w-full z-[9]">
    <Transition name="slide">
      <BaseNotice
        v-if="refferalBaseNoticeOpen"
        class="w-full h-14"
        variant="info"
        @close="() => (refferalBaseNoticeOpen = false)"
      >
        <p class="text-center">
          {{ t("promo_bar.refer") }}
        </p>
      </BaseNotice>
    </Transition>
    <WrapperAuthenticatedHeader v-if="isAuthenticated" />
    <WrapperPublicHeader v-else />
  </nav>
</template>
