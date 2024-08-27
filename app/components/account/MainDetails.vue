<script setup lang="ts">
// TODO: Add logic here and props
</script>

<template>
  <BaseContentBox>
    <template #title>
      <h2>Account Details</h2>
    </template>
    <div class="space-y-8 sm:space-y-4">
      <AccountSettingContainer>
        <template #title>
          <p>Username</p>
        </template>
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
      </AccountSettingContainer>
      <AccountSettingContainer>
        <template #title>
          <p>Email</p>
        </template>
        <template #default>
          <p>email.example@email.com</p>
        </template>
      </AccountSettingContainer>
      <AccountSettingContainer>
        <template #title>
          <p>Password</p>
        </template>
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
      </AccountSettingContainer>
      <AccountSettingContainer>
        <template #title>
          <p>Public ID</p>
        </template>
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
      </AccountSettingContainer>
    </div>
  </BaseContentBox>
</template>
