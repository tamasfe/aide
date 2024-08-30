<script setup lang="ts">
import { Popover, PopoverPanel } from "@headlessui/vue";

const open = ref(false);

const onOpen = () => {
  open.value = true;
};

const onClose = () => {
  open.value = false;
};
</script>

<template>
  <Popover
    class="relative"
  >
    <BaseInputGroup
      :placeholder="$t('placeholder.search')"
      placeholder-placement="default"
      error-placement="below"
      @focus="onOpen"
    >
      <template #prefix>
        <div class="mr-4 flex justify-center items-center">
          <Icon
            name="lucide:search"
            size="24"
          />
        </div>
      </template>
      <template #suffix>
        <div class="ml-4 flex justify-center items-center">
          <Icon
            name="lucide:x"
            size="24"
          />
        </div>
      </template>
    </BaseInputGroup>

    <BaseOverlay
      v-if="open"
      class="z-[12]"
      @click="onClose"
    />
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel
        v-if="open"
        class="absolute left-1/2 z-[13] mt-10 -translate-x-1/2 w-full outline-none"
        static
      >
        <div
          class="rounded-default bg-emphasis/85 backdrop-blur text-default p-4 outline-none"
          role="dialog"
          aria-modal="true"
        >
          <slot />
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>
