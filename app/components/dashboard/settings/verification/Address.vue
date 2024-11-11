<script setup lang="ts"></script>

<template>
  <DashboardSection :title="$t('dashboard.settings.verification.address')">
    <BaseButton
      variant="secondary"
      size="dashboard"
      class="gap-2"
    >
      <BaseIcon
        name="lucide:upload"
        :size="18"
      />
      {{ $t('button.upload') }}
    </BaseButton>
  </DashboardSection>
</template>
