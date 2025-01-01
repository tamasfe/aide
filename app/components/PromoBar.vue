<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const { $dependencies } = useNuxtApp();

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
const { data: notificationBanners } = await useAsyncData("promo-bar",
  () => $dependencies.notifications.ui.searchNotificationBannersFromPromoBar.handle(),
  { lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);

const onClickCloseNotification = (notificationId: number) => {
  if (!notificationBanners.value) return;

  // We do not await to increase snapiness. We suppose the request will be successful. Worst case scenario, the notification will reappear on the next page load and the error will be notified to us.
  $dependencies.notifications.ui.markNotificationBannerAsReadFromPromoBar.handle(notificationId);
  notificationBanners.value = notificationBanners.value.filter(banner => banner.id !== notificationId);
};

const promoBarVariants = cva(
  "min-h-10 lg:min-h-12 relative w-full flex flex-row items-center justify-center",
  {
    variants: {
      variant: {
        purple: "bg-promo-purple text-promo-purple",
      },
    },
    defaultVariants: {
      variant: "purple",
    },
  },
);

type PromoBarVariants = VariantProps<typeof promoBarVariants>;

const props = withDefaults(defineProps<{
  variant?: PromoBarVariants["variant"];
  class?: HTMLAttributes["class"];
}>(), {
  variant: "purple",
});
</script>

<template>
  <Transition name="slide">
    <div v-if="notificationBanners?.length">
      <BaseLink
        v-for="(banner, index) in notificationBanners"
        v-show="index === 0"
        :key="banner.id"
        :to="banner.data.link || ''"
        :class="cn(
          promoBarVariants({ variant }),
          props.class,
        )"
      >
        <div class="px-3 py-2 mr-10 text-sm md:text-base leading-tight text-left">
          {{ banner.data.message }}
        </div>
        <BaseButton
          variant="ghost"
          size="ghost"
          class="p-2 absolute right-1"
          @click="onClickCloseNotification(banner.id)"
        >
          <BaseIcon
            name="lucide:x"
            :size="20"
          />
        </BaseButton>
      </BaseLink>
    </div>
  </Transition>
</template>
