<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✴️
</script>

<template>
  <BaseForm>
    <div class="flex flex-row items-center justify-between">
      <div class="flex flex-row gap-2">
        <Icon
          name="lucide:arrow-left"
          size="20"
        />
        <div class="mb-2 leading-snug">
          <h2 class="text-xl font-semibold">{{ $t('modal_payments.finalize_deposit') }}</h2>
          <h3 class="text-sm font-medium text-subtle">{{ $t('modal_payments.finalize_deposit_subtitle') }}</h3>
        </div>
      </div>
      <NuxtImg
        class="w-[6rem] h-auto self-start"
        src="/assets/images/pix.svg"
        alt="Pix"
      />
    </div>

    <BaseButton
      size="xl"
      class="w-full"
    >
      {{ $t('button.copy_code', { remaining: '0:45' }) }}
    </BaseButton>
  </BaseForm>
</template>
