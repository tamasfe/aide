<script setup lang="ts">
const emit = defineEmits(["update:opened"]);

const { t } = useI18n();

const props = defineProps<{
  opened: boolean;
}>();

const opened = computed({
  get: () => props.opened,
  set: (value: boolean) => emit("update:opened", value),
});

const close = () => {
  opened.value = false;
};
</script>

<template>
  <ModalWrapper v-model:opened="opened">
    <form class="flex-auto flex sm:justify-center flex-col gap-4 p-6">
      <h1 class="text-2xl font-bold text-center">
        {{ t("cancel_registration.headline") }}
      </h1>
      <p class="text-emphasis text-lg text-center">
        {{ t("cancel_registration.body") }}
      </p>
      <BaseButton
        tabindex="0"
        class="w-full inline-flex justify-center text-lg !rounded-[0.3rem] !py-4 sm:!py-3"
        variant="primary"
        type="submit"
        big
      >
        {{ t("button.continue") }}
      </BaseButton>
      <button
        class="outline-none mx-auto font-medium inline-flex justify-center text-subtle hover:text-emphasis"
        type="button"
        big
        @click="close"
      >
        {{ t("cancel_registration.cancel") }}
      </button>
    </form>
  </ModalWrapper>
</template>
