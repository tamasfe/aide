<script setup lang="ts"></script>

<template>
  <DashboardSection>
    <template #title>
      <h2>Personal Details</h2>
    </template>
    <div class="space-y-8 sm:space-y-4">
      <DashboardSectionItem>
        <template #title>
          <p>Name</p>
        </template>
        <template #default>
          <p>Pedro</p>
        </template>
      </DashboardSectionItem>
      <DashboardSectionItem>
        <template #title>
          <p>Phone</p>
        </template>
        <template #default>
          <p>+55 (61) 314 202 63</p>
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
          <p>Date of Birth</p>
        </template>
        <template #default>
          <p>24.02.1990</p>
        </template>
      </DashboardSectionItem>
      <DashboardSectionItem>
        <template #title>
          <p>Address</p>
        </template>
        <template #default>
          <p>Viaduto do Chá, 15</p>
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
          <p>City</p>
        </template>
        <template #default>
          <p>SÃO PAULO - SP</p>
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
          <p>Postal Code</p>
        </template>
        <template #default>
          <p>01002-020</p>
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
          <p>Country</p>
        </template>
        <template #default>
          <p>Brasil</p>
        </template>
      </DashboardSectionItem>
      <DashboardSectionItem>
        <template #title>
          <p>Document</p>
        </template>
        <template #default>
          <p>CPF: 111-222</p>
        </template>
      </DashboardSectionItem>
    </div>
  </DashboardSection>
</template>
