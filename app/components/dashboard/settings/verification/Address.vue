<script setup lang="ts"></script>

<template>
  <DashboardSection :title="$t('dashboard.settings.verification.address')">
    <BaseButton
      variant="secondary"
      size="dashboard"
      class="h-9 md:h-10 w-fit gap-2"
    >
      <BaseIcon
        name="lucide:upload"
        :size="18"
      />
      {{ $t('button.upload') }}
    </BaseButton>
  </DashboardSection>
</template>
