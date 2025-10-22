<script setup lang="ts">
const userStore = useUserStore();
const siteStore = useSiteStore();
const nuxtApp = useNuxtApp();

const emit = defineEmits([
  "click:menu",
]);
</script>

<template>
  <nav class="w-full bg-subtle h-14">
    <div class="max-w-screen-xl mx-auto w-full px-4 h-full">
      <nav class="-mx-4 flex items-center justify-between gap-4 h-full">
        <div class="flex items-center gap-x-4 self-stretch pl-4">
          <BaseButton
            variant="ghost"
            size="ghost"
            class="hidden sm:block px-4 -mx-4 h-full text-subtle md:hover:text-emphasis transition-colors duration-200"
            @click="emit('click:menu')"
          >
            <BaseIcon
              name="lucide:menu"
              :size="26"
            />
          </BaseButton>

          <NuxtLinkLocale
            :to="{ name: 'index' }"
            class="h-full flex items-center"
          >
            <NuxtImg
              v-if="!userStore.isAuthenticated"
              class="h-5 sm:h-6"
              :src="siteStore.getRelativeAssetPath('logos/logo.svg')"
              alt="Logo"
            />
            <template v-else>
              <NuxtImg
                class="h-5 sm:hidden"
                :src="siteStore.getRelativeAssetPath('logos/logo-sm.svg')"
                alt="Logo"
              />
              <NuxtImg
                class="hidden sm:block h-5 sm:h-6"
                :src="siteStore.getRelativeAssetPath('logos/logo.svg')"
                alt="Logo"
              />
            </template>
          </NuxtLinkLocale>
        </div>

        <div class="flex items-center gap-3 pr-4">
          <template v-if="!userStore.isAuthenticated">
            <BaseButton
              id="app-header-login-button"
              variant="secondary"
              class=""
              @click="nuxtApp.callHook('frontend:command:modal:login:open')"
            >
              {{ $t("button.login") }}
            </BaseButton>
            <BaseButton
              variant="primary"
              class=""
              @click="nuxtApp.callHook('frontend:command:modal:register:open')"
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
              @click="nuxtApp.callHook('frontend:command:modal:deposit:open')"
            >
              {{ $t("button.deposit") }}
            </BaseButton>

            <NavUser class="-ml-2 -mr-4" />
          </template>
        </div>
      </nav>
    </div>
  </nav>
</template>
