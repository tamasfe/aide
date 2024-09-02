<script setup lang="ts"></script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex flex-col gap-4 w-full max-w-[30rem] bg-subtle rounded-default p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <BaseFlag
            country-code="BR"
            size="md"
          />
          <div class="text-subtle font-medium">BRL</div>
        </div>
        <div class="text-subtle">#89242982</div>
      </div>
      <div class="flex items-center justify-center text-3xl font-medium">
        <div><span class="bg-button-primary text-transparent bg-clip-text">R$</span>420.20</div>
      </div>
      <div class="flex flex-row gap-2">
        <BaseButton
          variant="secondary"
          size="md"
          class="w-full"
        >
          {{ $t('button.withdraw') }}
        </BaseButton>

        <BaseButton
          variant="emphasis"
          size="md"
          class="w-full"
        >
          {{ $t('button.deposit') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>
