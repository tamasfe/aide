<script setup lang="ts">
// DESIGN STATUS:       ✴️
//   * make every single part of the input/copy icon/button clickable to copy
//   * the inputgroup should also be set to text-subtle... but i dont like adding tons of "input-class, icon-class blah blah blah"
//   * after you style the color, the link should also be text-sm
//   * after that... the input + copy icon ALSO needs cursor-pointer
// ARCHITECTURE STATUS: ✴️
//   * implement real countdown (see on bet7k what happens when it runs out)
//   * G branded QR is VERY FUCKING COOL and adds a serious bit of chrome
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✴️
</script>

<template>
  <BaseForm class="gap-4 items-center">
    <div class="w-full flex flex-row items-center justify-between">
      <div class="flex flex-row gap-2">
        <BaseIcon
          name="lucide:arrow-left"
          :size="20"
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

    <NuxtImg
      src="/assets/images/qr.png"
      class="block w-[12rem] h-auto"
    />

    <div class="text-4xl font-bold bg-button-emphasis text-transparent bg-clip-text">R$ 100,00</div>

    <BaseInputGroup
      autocomplete="off"
      placeholder-placement="default"
      :disabled="true"
    >
      <template #suffix>
        <div class="ml-5 flex justify-center items-center">
          <BaseIcon
            name="lucide:copy"
            :size="24"
          />
        </div>
      </template>
    </BaseInputGroup>

    <BaseButton
      size="xl"
      class="w-full"
    >
      {{ $t('button.copy_code', { remaining: '0:45' }) }}
    </BaseButton>

    <BaseButton
      variant="ghost"
      size="md"
      class="my-4 text-subtle"
    >
      {{ $t("button.completed_payment") }}
    </BaseButton>
  </BaseForm>
</template>
