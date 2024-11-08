<script setup lang="ts">
// DESIGN STATUS: ✴️
//   * this needs to lock scroll when clicking into input AND automatically scroll near top of screen (use useScrollLock from vueuse)
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

import { Popover, PopoverPanel } from "@headlessui/vue";

const open = ref(false);
const loading = ref(false);
const query = useState("search-popover-query", () => "");

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
    <SearchBar
      v-model="query"
      :open="open"
      :loading="loading"
      :class="{ 'bg-emphasis': open }"
      @focus="onOpen"
      @close="onClose"
    />

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
        v-if="open && query !== ''"
        class="absolute z-[8] mt-3 w-full outline-none"
        static
      >
        <div
          class="rounded-default bg-emphasis/85 backdrop-blur text-default px-5 py-4 outline-none"
          role="dialog"
          aria-modal="true"
        >
          <SearchResults :query="query" />
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>
