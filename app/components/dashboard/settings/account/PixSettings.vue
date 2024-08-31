<script setup lang="ts"></script>

<template>
  <DashboardSection>
    <template #title>
      <h2>Pix Settings</h2>
    </template>
    <div class="space-y-8 sm:space-y-4">
      <DashboardSectionItem>
        <template #title>
          <p>Key Type</p>
        </template>
        <template #default>
          <p>CPF</p>
        </template>
        <template #actions>
          <div>
            <BaseButton
              class="w-full bg-emphasis !text-subtle-light hover:!text-emphasis !py-3 !font-medium !rounded-lg"
              type="button"
            >
              Change
            </BaseButton>
          </div>
        </template>
      </DashboardSectionItem>
      <DashboardSectionItem>
        <template #title>
          <p>Key Value</p>
        </template>
        <template #default>
          <p>078.843.426-85</p>
        </template>
      </DashboardSectionItem>
    </div>
  </DashboardSection>
</template>
