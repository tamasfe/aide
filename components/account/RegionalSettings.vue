<script setup lang="ts">
// TODO: Add logic here and props
</script>

<template>
  <BaseContentBox>
    <template #title>
      <h2>Regional Settings</h2>
    </template>
    <div class="space-y-8 sm:space-y-4">
      <AccountSettingContainer>
        <template #title>
          <p>Wallets</p>
        </template>
        <template #default>
          <div class="flex items-center gap-2">
            <BaseFlag
              code="BR"
              size="l"
            />
            <p>BRL (ID: #292482)</p>
          </div>
        </template>
      </AccountSettingContainer>
      <AccountSettingContainer>
        <template #title>
          <p>Language</p>
        </template>
        <template #default>
          <p>English</p>
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
          <p>Time zone</p>
        </template>
        <template #default>
          <p>Brazil (GMT-3) Monday, April 29, 2024, 15:37</p>
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
    </div>
  </BaseContentBox>
</template>
