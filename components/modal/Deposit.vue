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
  <ModalWrapper v-model:open="opened">
    <WrapperDeposit />
  </ModalWrapper>
</template>
