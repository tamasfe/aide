<template>
  <div class="fixed right-0 bottom-0 max-h-full w-full max-w-full md:max-w-[350px] p-3 gap-y-2 z-[998] overflow-y-auto applyScrollbarHide mb-[50px] md:mb-0">
    <button class="bg-green-500 w-full p-1 rounded text-white" @click="addTestNotification()">Spawn test notification</button>
    <NotificationsNotificationTile v-for="notification in getNotificationsList" :notification="notification"/>
  </div>
</template>

<script setup lang="ts">
const notificationStore = useNotificationStore();

const { getNotificationsList } = storeToRefs(notificationStore)

onMounted(() => {
  addTestNotification()
})

const generateType = () => {
  const types = [
    'success',
    'error',
    'info'
  ]

  const randomNumber = Math.floor(Math.random()*types.length);

  return types[randomNumber]
}

const addTestNotification = () => {
  console.log(generateType())
  notificationStore.addNotification({
    type: generateType(),
    title: 'Notification title',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  })
}
</script>

<style scoped>
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
</style>