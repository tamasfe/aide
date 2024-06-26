<script setup lang="ts">
import { ModalWrapper } from "#components";

const emit = defineEmits(["update:opened"]);

const props = defineProps<{
  opened: boolean;
}>();

const modal = ref<InstanceType<typeof ModalWrapper> | null>(null);

const opened = computed({
  get: () => props.opened,
  set: (value: boolean) => emit("update:opened", value),
});

const showInfo = (value: boolean) => {
  modal.value?.showImage(!value);
};

const close = () => {
  opened.value = false;
  modal.value?.reset();
};
</script>

<template>
  <ModalWrapper
    ref="modal"
    v-model:opened="opened"
  >
    <WrapperWithdraw
      @show:info="showInfo"
      @click:close="close"
    />
  </ModalWrapper>
</template>
