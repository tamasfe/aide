<template>
  <div
    v-if="store.getPromoNotificationOpen"
    class="relative flex items-center w-full py-1 px-2 md:py-2 md:px-3 bg-header-notification-bg text-header-notification-text text-center h-10"
  >
    <span class="flex-1 text-xs md:text-base">
      Refer a friend and earn <strong>R$ 5,00</strong> of REAL balance for each friend you invite 💥
    </span>
    <div
      class="p-2 md:p-0 cursor-pointer"
      @click="closePromoNotification()"
    >
      <img src="~/assets/images/icons/cross.svg">
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useTriggersStore();

const closePromoNotification = () => {
  store.setPromoNotificationState(false);
};
</script>