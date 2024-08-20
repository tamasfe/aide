<script setup lang="ts">
import { PhArrowLeft, PhCopy } from "@phosphor-icons/vue";

const { t } = useI18n();

const emit = defineEmits(["update:pix", "click:back"]);

const onSubmit = () => {
};

const goBack = () => {
  emit("click:back");
};

// TODO NO DEFAULTS, REMOVE ALL DEFAULTS ONLY HERE FOR TESTING PURPOSES
defineProps<{
  value: number;
  pix: string;
  qr: string;
}>();
</script>

<template>
  <form
    class="flex flex-col items-center gap-4 w-full"
    @submit="onSubmit"
  >
    <div class="w-full flex items-center justify-between">
      <button
        type="button"
        class="outline-none text-subtle cursor-pointer"
        @click="goBack"
      >
        <PhArrowLeft :size="30" />
      </button>
      <NuxtImg
        class="max-h-8"
        src="/assets/images/pix-logo.svg"
        alt="Pix"
      />
    </div>
    <!-- gradient text -->
    <p
      class="bg-button-emphasis text-transparent bg-clip-text text-3xl font-bold"
    >
      R$ {{ value }}
    </p>
    <div class="w-full h-40 inline-flex justify-center">
      <NuxtImg
        :src="qr"
        alt="Pix Code"
        class="h-full"
      />
    </div>
    <div
      class="w-full bg-subtle p-4 flex gap-2 justify-between overflow-hidden break-words rounded-default"
    >
      <p class="text-subtle overflow-hidden text-wrap">
        {{ pix }}
      </p>
      <button
        type="button"
        class="outline-none text-subtle"
      >
        <PhCopy :size="24" />
      </button>
    </div>
    <BaseButton
      variant="primary"
      big
      shadow
      class="w-full inline-flex justify-center text-base sm:text-lg"
    >
      {{ t('button.copy_code', { remaining: '0:45' }) }}
    </BaseButton>
    <NuxtLink
      to="/completed/payment"
      class="text-brand-yellow"
    >
      {{ t('modal_payments.completed_payment') }}
    </NuxtLink>
  </form>
</template>
