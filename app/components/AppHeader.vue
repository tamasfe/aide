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
  <nav class="sticky top-0 left-0 w-full z-[9] ">
    <PromoBar />

    <div class="w-full bg-subtle h-14">
      <div class="giro__container flex items-center justify-between h-full gap-4">
        <div class="flex items-center gap-x-4 self-stretch">
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
              src="/assets/images/logos/logo.svg"
              alt="Logo"
            />
            <template v-else>
              <NuxtImg
                class="h-7 sm:hidden"
                src="/assets/images/logos/logo-sm.svg"
                alt="Logo"
              />
              <NuxtImg
                class="hidden sm:block h-7"
                src="/assets/images/logos/logo.svg"
                alt="Logo"
              />
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
