<script setup lang="ts">
const { t } = useI18n();

// DESIGN STATUS:       ✴️
//   * user icon size is stupid
//   * ButtonNew might need to be overridden for md size (md size probably shouldnt change as it looks fine elsewhere just not in the menu)
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const authenticated = ref(true);
</script>

<template>
  <nav class="sticky top-0 left-0 w-full z-[9]">
    <PromoBar />

    <div class="w-full bg-subtle">
      <div
        class="giro__container flex items-center justify-between py-[0.525rem] sm:py-2"
      >
        <div class="flex items-center gap-x-8">
          <BaseButtonNew
            variant="ghost"
            size="ghost"
            class="hidden sm:block"
          >
            <Icon
              name="lucide:menu"
              size="30"
              class="text-subtle"
            />
          </BaseButtonNew>
          <NuxtLink
            to="/"
            :class="[authenticated ? 'min-w-8 sm:min-w-[8.5rem]' : 'min-w-32 sm:min-w-[8.5rem]']"
          >
            <IconLogo v-if="!authenticated" />
            <template v-else>
              <IconLogoSmall class="sm:hidden" />
              <IconLogo class="hidden sm:block" />
            </template>
          </NuxtLink>
        </div>

        <div class="flex items-center space-x-[0.625rem] sm:space-x-4">
          <template v-if="!authenticated">
            <BaseButtonNew
              variant="secondary"
              class="h-9 md:h-10"
            >
              {{ t("button.login") }}
            </BaseButtonNew>
            <BaseButtonNew
              variant="primary"
              class="h-9 md:h-10"
            >
              {{ t("button.register") }}
            </BaseButtonNew>
          </template>
          <template v-else>
            <BaseButtonNew
              variant="secondary"
              class="h-9 md:h-10 space-x-1"
            >
              <div class="bg-button-primary text-transparent bg-clip-text">R$</div>
              <div class="text-white">69,50</div>
            </BaseButtonNew>

            <BaseButtonNew
              variant="emphasis"
              class="h-9 md:h-10"
            >
              {{ t("button.deposit") }}
            </BaseButtonNew>

            <NuxtLink class="text-subtle hover:text-emphasis cursor-pointer">
              <span class="block">
                <Icon
                  name="lucide:user"
                  size="26"
                  class="align-middle"
                />
              </span>
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
