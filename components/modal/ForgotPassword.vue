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
  <BaseDialog
    v-bind="$attrs"
    v-model:open="open"
    banner="none"
  >
    <FormForgotPassword />
  </BaseDialog>
</template>
