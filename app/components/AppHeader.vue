<script setup lang="ts">
// DESIGN STATUS:       ✴️
//   * user icon size is stupid
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
const { $dependencies } = useNuxtApp();

const authenticated = ref(false);

const onClickBalance = async () => {
  await navigateTo("/settings/wallet");
};

const onClickUnauthenticatedAccountLogo = async () => {
  $dependencies.asyncMessagePublisher.emit(
    "girobet:commands:modals:open-login",
    {}
  );
};
</script>

<template>
  <nav class="sticky top-0 left-0 w-full z-[9]">
    <PromoBar />

    <div class="w-full bg-subtle">
      <div
        class="giro__container flex items-center justify-between py-[0.525rem] sm:py-2"
      >
        <div class="flex items-center gap-x-8">
          <BaseButton variant="ghost" size="ghost" class="hidden sm:block">
            <Icon name="lucide:menu" size="30" class="text-subtle" />
          </BaseButton>
          <NuxtLink
            to="/"
            :class="[
              authenticated
                ? 'min-w-8 sm:min-w-[8.5rem]'
                : 'min-w-32 sm:min-w-[8.5rem]',
            ]"
          >
            <IconLogo v-if="!authenticated" />
            <template v-else>
              <IconLogoSmall class="sm:hidden" />
              <IconLogo class="hidden sm:block" />
            </template>
          </NuxtLink>
        </div>

        <div class="flex items-center gap-2.5 sm:gap-3">
          <template v-if="!authenticated">
            <BaseButton
              id="app-header-login-button"
              variant="secondary"
              class="h-9 md:h-10"
              @click="onClickUnauthenticatedAccountLogo"
            >
              {{ $t("button.login") }}
            </BaseButton>
            <BaseButton variant="primary" class="h-9 md:h-10">
              {{ $t("button.register") }}
            </BaseButton>
          </template>
          <template v-else>
            <BaseButton
              variant="secondary"
              class="h-9 md:h-10 space-x-1"
              @click="onClickBalance"
            >
              <div class="bg-button-primary text-transparent bg-clip-text">
                R$
              </div>
              <div class="text-white">69,50</div>
            </BaseButton>

            <BaseButton variant="emphasis" class="h-9 md:h-10">
              {{ $t("button.deposit") }}
            </BaseButton>

            <NavUser />
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
