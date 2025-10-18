<script setup lang="ts">
const localePath = useLocalePath();
const siteStore = useSiteStore();
const walletStore = useWalletStore();
const { params } = useRoute();
const userModule = useUserModule();
</script>

<template>
  <div class="bg-subtle h-14 flex items-center w-full flex-shrink-0 gap-3 px-4">
    <NuxtLink :to="localePath({ name: 'index' })" class="mr-auto">
      <NuxtImg
        class="h-5"
        :src="siteStore.getRelativeAssetPath('logos/logo.svg')"
        alt="Logo"
      />
    </NuxtLink>
    <BaseButton
      v-if="walletStore.wallet"
      id="app-header-deposit-button"
      variant="emphasis"
      @click="userModule.ui.emitCommandOpenUserActionModal.handle('deposit')"
    >
      {{ $t("button.deposit") }}
    </BaseButton>

    <NuxtLink
      :to="localePath({ name: 'games-provider-game', params: params })"
      class="px-4 -mr-4 h-full flex justify-center items-center text-subtle md:hover:text-subtle-light -ml-2"
      replace
    >
      <div class="px-[2px]">
        <BaseIcon
          name="lucide:x"
          :size="22"
        />
      </div>

    </NuxtLink>
  </div>
</template>
