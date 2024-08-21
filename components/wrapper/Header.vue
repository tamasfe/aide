<script setup lang="ts">
const { t } = useI18n();

const promoBarOpen = ref(true);
const authenticated = ref(false);
</script>

<template>
  <nav class="sticky top-0 left-0 w-full z-[9]">
    <Transition name="slide">
      <BaseNotice
        v-if="promoBarOpen"
        class="w-full text-[0.9rem]"
        variant="info"
      >
        <p class="text-center">
          {{ t("promo_bar.refer") }}
        </p>
      </BaseNotice>
    </Transition>

    <WrapperAuthenticatedHeader v-if="authenticated" />
    <WrapperPublicHeader v-else />
  </nav>
</template>
