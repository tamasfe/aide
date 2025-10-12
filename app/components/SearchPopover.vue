<script setup lang="ts">
// DESIGN STATUS: ✴️
//   * locks scroll when focusing input + auto-scrolls near top (vueuse)
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

import { nextTick, onMounted, ref } from "vue";
import { useState } from "#app";

const open = ref(false);
const query = useState("search-popover-query", () => "");

// Reference to the container for hydration check
const containerEl = ref<HTMLElement | null>(null);

// lock <body> scroll while popover is open
const bodyEl = ref<HTMLElement | null>(null);
onMounted(() => {
  bodyEl.value = document.body ?? null;

  anchorEl.value = containerEl.value;

  // Check if input is already focused after hydration
  checkFocusAfterHydration();
});

const checkFocusAfterHydration = async () => {
  // Wait for the DOM to be fully ready
  await nextTick();

  const container = containerEl.value;
  if (!container) return;

  // Find the input element within our component
  const inputEl = container.querySelector("input") as HTMLInputElement;

  // If the input is already focused (user focused before hydration), open the popover
  if (inputEl && document.activeElement === inputEl) {
    onOpen();
    return;
  }

  // Fallback: Check again after a short delay in case focus detection was too early
  setTimeout(() => {
    if (inputEl && document.activeElement === inputEl && !open.value) {
      onOpen();
    }
  }, 100);
};

// watch(open, (isOpen) => {
//   if (bodyEl.value) locked.value = isOpen;
// });

// anchor for positioning + scroll-to target
const anchorEl = ref<HTMLElement | null>(null);

const scrollNearTop = async () => {
  await nextTick();
  const el = anchorEl.value;
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const pad = 80; // px from viewport top
  const target = window.scrollY + rect.top - pad;
  if (Math.abs(rect.top - pad) > 4)
    window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
};

const onOpen = async () => {
  await scrollNearTop();
  open.value = true;
};
const onClose = () => {
  open.value = false;
};

// Handle focus events more intelligently
const handleFocusOut = (event: FocusEvent) => {
  // Check if the new focus target is within our component
  const relatedTarget = event.relatedTarget as HTMLElement;
  const currentTarget = event.currentTarget as HTMLElement;

  // If focus is moving to something within our component, don't close
  if (relatedTarget && currentTarget.contains(relatedTarget)) {
    return;
  }

  // If focus is moving outside our component, close the popover
  onClose();
};
</script>

<template>
  <div
    ref="containerEl"
    class="relative"
    @focusout="handleFocusOut"
  >
    <div class="flex border border-muted/5 w-full bg-subtle rounded overflow-hidden">
      <slot name="prefix" />
      <div class="flex-grow-1 w-full">
        <SearchBar
          v-model="query"
          input-size="lg"

          @focus="onOpen"
          @clear="() => {
            query = '';
            onClose()
          }"
        />
      </div>
      <slot name="suffix" />
    </div>

    <div
      v-if="open"
      class="z-[5] absolute w-full top-[calc(100%+0.5rem)] rounded bg-emphasis/90 backdrop-blur-2xl px-5 py-4 shadow-xl border border-muted/10"
      tabindex="-1"
      @mousedown.prevent
    >
      <SearchResults :query="query" />
    </div>
  </div>
</template>
