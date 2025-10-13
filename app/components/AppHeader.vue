<script setup lang="ts">
// DESIGN STATUS:       ✴️
//   * user icon size is stupid
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
const { $dependencies } = useNuxtApp();
const userStore = useUserStore();
const siteStore = useSiteStore();

const emit = defineEmits([
  "click:menu",
]);
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-10 print:hidden">
    <!-- Reactivate when we want to have the notifications show again for PWA and others: <PromoBar /> -->

    <div class="w-full bg-subtle h-14">
      <div class="max-w-screen-xl mx-auto w-full px-4 h-full">
        <nav class="-mx-4 flex items-center justify-between gap-4 h-full">
          <div class="flex items-center gap-x-4 self-stretch pl-4">
            <BaseButton
              variant="ghost"
              size="ghost"
              class="hidden sm:block px-4 -mx-4 h-full text-subtle hover:text-emphasis transition-colors duration-200"
              @click="emit('click:menu')"
            >
              <BaseIcon
                name="lucide:menu"
                :size="26"
              />
            </BaseButton>

            <BaseLink
              :to="{ name: 'index' }"
              class="h-full flex items-center"
            >
              <NuxtImg
                v-if="!userStore.isAuthenticated"
                class="h-7"
                :src="siteStore.getRelativeAssetPath('logos/logo.svg')"
                alt="Logo"
              />
              <template v-else>
                <NuxtImg
                  class="h-7 sm:hidden"
                  :src="siteStore.getRelativeAssetPath('logos/logo-sm.svg')"
                  alt="Logo"
                />
                <NuxtImg
                  class="hidden sm:block h-7"
                  :src="siteStore.getRelativeAssetPath('logos/logo.svg')"
                  alt="Logo"
                />
              </template>
            </BaseLink>
          </div>

          <div class="flex items-center gap-3 pr-4">
            <template v-if="!userStore.isAuthenticated">
              <BaseButton
                id="app-header-login-button"
                variant="secondary"
                class=""
                @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('login')"
              >
                {{ $t("button.login") }}
              </BaseButton>
              <BaseButton
                variant="primary"
                class=""
                @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('register')"
              >
                {{ $t("button.register") }}
              </BaseButton>
            </template>
            <template v-else>
              <NavWalletBalance />

              <BaseButton
                id="app-header-deposit-button"
                variant="emphasis"
                class=""
                @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('deposit')"
              >
                {{ $t("button.deposit") }}
              </BaseButton>
              <NavUser class="-ml-2 -mr-4" />
            </template>
          </div>
        </nav>
      </div>
    </div>
  </nav>
</template>
