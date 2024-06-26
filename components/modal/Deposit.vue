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
  <ModalWrapper v-model:opened="opened">
    <WrapperDeposit />
  </ModalWrapper>
</template>
