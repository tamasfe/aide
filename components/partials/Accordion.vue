<template>
  <div class="w-full flex flex-col">
    <div
      class="w-full flex px-3 py-6 text-white font-semibold font-montserrat capitalize hover:bg-[#171922] cursor-pointer"
      @click="triggered = !triggered"
    >
      <span class="flex-1">
        {{ label }}
      </span>
      <img
        src="/icons/chevron-down.svg"
        class="transition w-4"
        :class="{ 'rotate-180': triggered }"
      >
    </div>
    <Transition>
      <div
        v-if="triggered"
        class="w-full flex flex-col overflow-hidden transition-all"
      >
        <slot />
      </div>
    </Transition>
  </div>
</template>

<script setup>
const triggered = ref(false);

defineProps({
  label: {
    type: String,
    default: "",
  },
});
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
