<template>
  <Transition>
    <li
      v-if="show"
      class="block list-none relative w-full rounded p-4 pr-10 shadow-2xl mt-2"
      :class="{
        'bg-green-500': notification.type === 'success',
        'bg-red-600': notification.type === 'error',
        'bg-sky-600': notification.type === 'info'
      }"
    >
      <div class="absolute right-3 top-3 p-2 cursor-pointer hover:bg-green-600 rounded transition" @click="show = false">
        <img src="~/assets/images/icons/cross.svg">
      </div>
      <div class="text-white font-montserrat font-semibold text-sm md:text-base">
        {{ notification.title }}
      </div>
      <div class="mt-2 text-sm text-white font-montserrat">
        {{ notification.text }}
      </div>
    </li>
  </Transition>
</template>

<script setup lang="ts">
defineProps({
  notification: {
    type: Object,
    default: {}
  }
})

const show = ref(true);

onMounted(() => {
  setTimeout(() => {
    show.value = false
  }, 3500)
})
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.35s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>