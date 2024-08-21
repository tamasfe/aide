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
        {{ t("modal_cancel_registration.headline") }}
      </h1>

      <p class="text-emphasis text-lg text-center">
        {{ t("modal_cancel_registration.body") }}
      </p>

      <BaseButtonNew
        size="xl"
        class="w-full"
        type="submit"
      >
        {{ t("button.continue") }}
      </BaseButtonNew>

      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="mt-6 font-semibold text-subtle hover:text-subtle-light"
        @click="close"
      >
        {{ t("modal_cancel_registration.cancel") }}
      </BaseButtonNew>
    </form>
  </ModalWrapper>
</template>
