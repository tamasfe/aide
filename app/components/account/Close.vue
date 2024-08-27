<script setup lang="ts">
// TODO: Add logic here and props
</script>

<template>
  <BaseContentBox>
    <template #title>
      <h2>Close Account</h2>
    </template>
    <div class="flex flex-col sm:flex-row sm:justify-between gap-x-24 gap-y-4">
      <p class="text-subtle-light font-medium">
        Your account will be deactivated and you will be excluded from any
        further communications from GiroBet.
      </p>
      <div>
        <BaseButton
          class="w-full bg-button-danger hover:text-emphasis !py-3 !font-medium !rounded-lg"
          type="button"
        >
          Close My Account
        </BaseButton>
      </div>
    </div>
  </BaseContentBox>
</template>
