<template>
  <div
    v-if="store.getPromoNotificationOpen"
    class="relative flex w-full p-3 bg-[#A38BD7] text-white text-center"
  >
    <span class="flex-1">
      Refer a friend and earn <strong>R$ 5,00</strong> of REAL balance for each friend you invite 💥
    </span>
    <div
      class="p-1 cursor-pointer"
      @click="closePromoNotification()"
    >
      <img src="/icons/cross.svg">
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useTriggersStore();

const closePromoNotification = () => {
  store.setPromoNotificationState(false);
};
</script>