<script setup lang="ts">
const query = useState("search-modal-query", () => "");
const nuxtApp = useNuxtApp();
const open = ref(false);

useActiveModals("search", open);

useRuntimeHook("frontend:command:modal:search:open", () => {
  open.value = true;
});

useRuntimeHook("frontend:command:modal:search:close", () => {
  open.value = false;
});

useRuntimeHook("frontend:command:modal:close", () => {
  open.value = false;
});

watch(open, (newValue) => {
  if (newValue) {
    nuxtApp.callHook("frontend:event:modal:search:opened");
  }
  else {
    nuxtApp.callHook("frontend:event:modal:search:closed");
  }
});
</script>

<template>
  <BaseModal
    v-model:open="open"
    banner="none"
    class="sm:max-w-screen-lg sm:mx-4 sm:h-[80vh]"
  >
    <SearchBar
      v-model="query"
      input-size="lg"
    />

    <transition
      :duration="100"
      enter-active-class="transition ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <div
        v-show="open"
        class="px-0 rounded text-default p-4 outline-none"
        role="dialog"
        aria-modal="true"
      >
        <SearchResults :query="query" />
      </div>
    </transition>
  </BaseModal>
</template>
