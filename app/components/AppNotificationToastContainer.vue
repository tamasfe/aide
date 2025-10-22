<script setup lang="ts">
const notificationsStore = useNotificationsStore();
const userStore = useUserStore();
const notificationModule = useNotificationModule();

const notifications = useAsyncData(
  () => notificationModule.ui.searchLastUnreadNotificationToasts.handle(),
  {
    lazy: true,
    server: false,
    watch: [() => userStore.isAuthenticated],
  },
);

watch(notifications.data, (value) => {
  value?.map(notification => notificationsStore.showToast(notification));
});

useRuntimeHook("backend:event:notification:received", async ({ notification }) =>
  notificationModule.ui.showNotificationToastToStoreFromWebsocketBackendNotification.handle(notification));
</script>

<template>
  <!-- Global notification live region, render this permanently at the end of the document -->
  <div aria-live="assertive" class="z-10 pointer-events-none fixed left-0 right-0 top-14 bottom-14 sm:bottom-0 p-4 flex items-start">
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
      <TransitionGroup
        enter-active-class="transform ease-out duration-500 transition"
        enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-6"
        enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <NotificationToast
          v-for="toast in notificationsStore.toasts"
          :key="toast.id"
          :variant="toast.variant"
          :message="toast.message"
          :title="toast.title"
          @close="notificationsStore.clearToast(toast.id)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>
