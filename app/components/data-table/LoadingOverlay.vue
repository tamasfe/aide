<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();
</script>

<template>
  <Transition>
    <div
      v-if="loading"
      class="absolute left-0 top-0 w-full h-full bg-default/60 flex items-center justify-center"
    >
      <BaseSpinner
        :size="40"
        class="text-subtle"
      />
    </div>
  </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
