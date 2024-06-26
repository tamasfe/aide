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
  <ModalWrapperHorizontal v-model:opened="opened">
    <div class="flex-1 px-6 sm:py-6">
      <FormInvite />
    </div>
  </ModalWrapperHorizontal>
</template>
