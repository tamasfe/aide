<template>
  <div class="relative w-full">
    <div class="flex items-center rounded px-[14px] py-[9px] bg-[#2F323C] text-white hover:cursor-pointer select-none" @click="showDropdown = !showDropdown">
      <span :class="'fi fi-'+ modelValue.flag" class="text-sm"></span>
      <span class="mx-2 flex-1">
        {{ modelValue.label }}
      </span>
      <img src="/icons/chevron-down.svg" alt="chevron icon" class="transition" :class="{'rotate-180': showDropdown}">
    </div>
    <Transition>
      <div v-if="showDropdown" ref="itemsWrapper" class="absolute top-full w-full mt-2 hover:cursor-pointer select-none rounded overflow-hidden">
        <div
          v-for="item in items"
          class="w-full flex items-center px-[14px] py-[9px] bg-[#2F323C] hover:bg-[#232630] text-white"
          @click="emit('update:modelValue', item); showDropdown = false"
        >
          <span :class="'fi fi-'+ item.flag" class="text-sm"></span>
          <span class="mx-2 flex-1">
            {{ item.label }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['modelValue', 'items'])
const emit = defineEmits(['update:modelValue'])

const itemsWrapper:Ref = ref(null);

let showDropdown = ref(false);
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.35s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>