<script setup lang="ts">
const emit = defineEmits(["update:opened"]);

const props = defineProps<{
  opened: boolean;
}>();

const opened = computed({
  get: () => props.opened,
  set: (value: boolean) => emit("update:opened", value),
});
</script>

<template>
  <ModalWrapper
    v-model:opened="opened"
    banner="top"
  >
    <div class="flex-1 px-6 sm:py-6">
      <FormInvite />
    </div>
  </ModalWrapper>
</template>
