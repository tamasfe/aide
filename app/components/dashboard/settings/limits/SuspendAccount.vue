<script setup lang="ts"></script>

<template>
  <DashboardSection :title="$t('dashboard.settings.limits.suspend_account')">
    <BaseButton
      variant="secondary"
      size="dashboard"
    >
      {{ $t('button.confirm') }}
    </BaseButton>
  </DashboardSection>
</template>
