<script setup lang="ts">
const emit = defineEmits(["update:opened"]);

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
        Are you sure you want to cancel your registration?
      </h1>
      <p class="text-emphasis text-lg text-center">
        Sign Up and deposit now to receive double your deposit, up to R$ 7000!
      </p>
      <BaseButton
        tabindex="0"
        class="w-full inline-flex justify-center text-lg [border-radius:0.3rem]"
        variant="primary"
        type="submit"
        big
      >
        Continue
      </BaseButton>
      <BaseButton
        class="w-full inline-flex justify-center text-subtle"
        type="button"
        big
        @click="close"
      >
        Yes, I want to cancel
      </BaseButton>
    </form>
  </ModalWrapper>
</template>
