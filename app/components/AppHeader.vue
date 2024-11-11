<script setup lang="ts">
// DESIGN STATUS:       ✴️
//   * user icon size is stupid
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
const { $dependencies } = useNuxtApp();
const userStore = useUserStore();

const emit = defineEmits([
  "click:menu",
]);
</script>

<template>
  <nav class="sticky top-0 left-0 w-full z-[9]">
    <PromoBar />

    <div class="w-full bg-subtle">
      <div class="giro__container flex items-center justify-between py-[0.525rem] sm:py-2">
        <div class="flex items-center gap-x-8">
          <BaseButton
            variant="ghost"
            size="ghost"
            class="hidden sm:block"
            @click="emit('click:menu')"
          >
            <BaseIcon
              name="lucide:menu"
              :size="30"
              class="text-subtle"
            />
          </BaseButton>
          <NuxtLink
            :to="{ name: 'index' }"
            :class="[
              userStore.isAuthenticated
                ? 'min-w-8 sm:min-w-[8.5rem]'
                : 'min-w-32 sm:min-w-[8.5rem]',
            ]"
          >
            <IconLogo v-if="!userStore.isAuthenticated" />
            <template v-else>
              <IconLogoSmall class="sm:hidden" />
              <IconLogo class="hidden sm:block" />
            </template>
          </NuxtLink>
        </div>

        <div class="flex items-center gap-2.5 sm:gap-3">
          <template v-if="!userStore.isAuthenticated">
            <BaseButton
              id="app-header-login-button"
              variant="secondary"
              class="h-9 md:h-10"
              @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('login')"
            >
              {{ $t("button.login") }}
            </BaseButton>
            <BaseButton
              variant="primary"
              class="h-9 md:h-10"
              @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('register')"
            >
              {{ $t("button.register") }}
            </BaseButton>
          </template>
          <template v-else>
            <NavWalletBalance class="h-9 md:h-10 space-x-1" />

            <BaseButton
              variant="emphasis"
              class="h-9 md:h-10"
            >
              {{ $t("button.deposit") }}
            </BaseButton>

            <NavUser />
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
