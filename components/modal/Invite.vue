<script setup lang="ts">
const emit = defineEmits(["update:open"]);

const props = defineProps<{
  open: boolean;
}>();

const open = computed({
  get: () => props.open,
  set: (value: boolean) => emit("update:open", value),
});
</script>

<template>
  <BaseModal
    v-model:open="open"
    banner="top"
  >
    <div class="flex-1 px-6 sm:py-6">
      <FormInvite />
    </div>
  </BaseModal>
</template>
