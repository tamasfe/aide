<script setup lang="ts">
import { Popover, PopoverPanel } from "@headlessui/vue";

// DESIGN STATUS ✴️
//   - The text is too large on mobile which goes back to refactoring InputGroup in a PROPER way to add size. we might not use "variants" because those can only output ONE string of classes (i think) and what we want is an initial variant that also creates other classes for input class, etc. or we can do inputClass, iconClass, etc, but in general that is ugly

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
      class="relative z-[8]"
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
      class="z-[7]"
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
        class="absolute z-[8] mt-3 w-full outline-none"
        static
      >
        <div
          class="rounded-default bg-emphasis/85 backdrop-blur text-default p-4 outline-none"
          role="dialog"
          aria-modal="true"
        >
          <WrapperScrollerGame />
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>
