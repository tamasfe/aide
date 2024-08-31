<script setup lang="ts"></script>

<template>
  <DashboardSection :title="$t('dashboard.settings.account.account_details')">
    <DashboardSectionItem :name="$t('dashboard.settings.account.username')">
      <template #default>
        <p>username.563778</p>
      </template>
      <template #description>
        <p>Usernames are public and will show in leaderboards.</p>
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
    <DashboardSectionItem :name="$t('dashboard.settings.account.email')">
      <template #default>
        <p>email.example@email.com</p>
      </template>
    </DashboardSectionItem>
    <DashboardSectionItem :name="$t('dashboard.settings.account.password')">
      <template #default>
        <p>*************</p>
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
    <DashboardSectionItem :name="$t('dashboard.settings.account.public_id')">
      <template #default>
        <p>AA23 N34G PP7T STSA</p>
      </template>
      <template #description>
        <p>
          Use this ID when you need to share with 3rd parties (including
          GiroBet Support) so your account is always secure.
        </p>
      </template>
      <template #actions>
        <div>
          <BaseButton
            class="w-full bg-emphasis !text-subtle-light hover:!text-emphasis !py-3 !font-medium !rounded-lg"
            type="button"
          >
            Copy
          </BaseButton>
        </div>
      </template>
    </DashboardSectionItem>
  </DashboardSection>
</template>
