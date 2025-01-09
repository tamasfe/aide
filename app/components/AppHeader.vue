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
        <div class="flex items-center gap-x-4 self-stretch">
          <BaseButton
            variant="ghost"
            size="ghost"
            class="hidden sm:block p-4 -m-4"
            @click="emit('click:menu')"
          >
            <BaseIcon
              name="lucide:menu"
              :size="26"
              class="text-subtle"
            />
          </BaseButton>

          <BaseLink
            :to="{ name: 'index' }"
            :class="[
              userStore.isAuthenticated
                ? 'min-w-8 sm:min-w-[8.5rem]'
                : 'min-w-32 sm:min-w-[8.5rem]',
            ]"
            class="-my-4 -mr-4 py-4 pr-4"
          >
            <IconLogo v-if="!userStore.isAuthenticated" />
            <template v-else>
              <IconLogoSmall class="sm:hidden" />
              <IconLogo class="hidden sm:block" />
            </template>
          </BaseLink>
        </div>

        <div class="flex items-center gap-3 sm:gap-3">
          <template v-if="!userStore.isAuthenticated">
            <BaseButton
              id="app-header-login-button"
              variant="secondary"
              class="self-stretch"
              @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('login')"
            >
              {{ $t("button.login") }}
            </BaseButton>
            <BaseButton
              variant="primary"
              class="self-stretch"
              @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('register')"
            >
              {{ $t("button.register") }}
            </BaseButton>
          </template>
          <template v-else>
            <NavWalletBalance class="space-x-1 self-stretch" />

            <BaseButton
              variant="emphasis"
              class="self-stretch"
              @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('deposit')"
            >
              {{ $t("button.deposit") }}
            </BaseButton>

            <NavUser class="ml-2" />
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
