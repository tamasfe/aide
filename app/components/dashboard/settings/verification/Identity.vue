<script setup lang="ts"></script>

<template>
  <DashboardSection :title="$t('dashboard.settings.verification.identity')">
    <BaseButton
      variant="secondary"
      size="dashboard"
      class="gap-2"
    >
      <Icon
        name="lucide:upload"
        size="18"
      />
      {{ $t('button.upload') }}
    </BaseButton>
  </DashboardSection>
</template>
