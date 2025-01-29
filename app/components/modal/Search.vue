<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const loading = ref(false);
const query = useState("search-modal-query", () => "");

defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});

const onClose = () => {
  $dependencies.users.ui.emitCommandCloseUserActionModal.handle();
};
</script>

<template>
  <BaseModal
    :open="open"
    :disabled="false"
    :close-on-click-outside="true"
    banner="none"
    @close="onClose"
  >
    <SearchBar
      v-model="query"
      :open="open"
      :loading="loading"
      @close="onClose"
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
        v-show="open && query !== ''"
        class="px-0 rounded text-default p-4 outline-none"
        role="dialog"
        aria-modal="true"
      >
        <SearchResults :query="query" />
      </div>
    </transition>
  </BaseModal>
</template>
