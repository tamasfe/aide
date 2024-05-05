<template>
  <div class="relative w-full" id="dropdownWrapper">
    <div
      class="flex items-center rounded px-[14px] py-[9px] bg-dropdown-bg text-dropdown-text hover:cursor-pointer select-none"
      @click="showDropdown = !showDropdown"
    >
      <span
        :class="'fi fi-'+ modelValue.flag"
        class="text-sm"
      />
      <span class="mx-2 flex-1">
        {{ modelValue.label }}
      </span>
      <img
        src="~/assets/images/icons/chevron-down.svg"
        alt="chevron icon"
        class="transition"
        :class="{ 'rotate-180': showDropdown }"
      >
    </div>
    <Transition>
      <div
        v-if="showDropdown"
        ref="itemsWrapper"
        class="absolute w-full hover:cursor-pointer select-none rounded overflow-hidden"
        :class="{ 'top-full mt-2': openDirection === 'bottom', 'bottom-full mb-2': openDirection === 'top' }"
      >
        <div
          v-for="item in items"
          class="w-full flex items-center px-[14px] py-[9px] bg-dropdown-bg hover:bg-dropdown-hover-bg text-dropdown-text"
          @click="emit('update:modelValue', item); showDropdown = false"
        >
          <span
            :class="'fi fi-'+ item.flag"
            class="text-sm"
          />
          <span class="mx-2 flex-1">
            {{ item.label }}
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["modelValue", "items"]);
const emit = defineEmits(["update:modelValue"]);

const itemsWrapper: Ref = ref(null);

const showDropdown = ref(false);

const onCLickOutside = (event: MouseEvent) => {
    const wrapper = document.querySelector('#dropdownWrapper');
    const isVisible = wrapper?.contains(event.target as Node);
    if (!isVisible) {
      showDropdown.value = false;
    }
  }

onMounted(() => {
  document.addEventListener('click', onCLickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onCLickOutside, false)
})

const openDirection = computed(() => {
  let style = 'bottom';
  let element = itemsWrapper.value;
  if(element) {
    if (window.innerHeight - element.getBoundingClientRect().bottom < element.scrollHeight){
      style = 'top'
    }
  }

  return style
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
  transform: translateY(5px);
}
</style>
