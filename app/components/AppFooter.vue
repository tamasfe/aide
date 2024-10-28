<script setup lang="ts">
import { ACTIVE_LOCALES } from "~/constants";
import type { Locale } from "~/types/constants";

// DESIGN STATUS:       ✴️
//   * logos for payment providers
// ARCHITECTURE STATUS: ✴️
//   * logo should be refactored out like the <AppHeader> component
// TRANSLATION STATUS:  ✅

const { localeProperties } = useI18n();

const year = ref(new Date().getFullYear());

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const initialOption: Locale | undefined = ACTIVE_LOCALES.find(
  (option) => {
    const exactMatch = option.value === localeProperties.value.language;
    if (exactMatch) return true;
    const partialMatch = option.value.split("-")[0] === localeProperties.value.code.split("-")[0];
    return partialMatch;
  },
);
</script>

<template>
  <footer class="mt-8 pt-6 pb-2 md:py-12 bg-subtle flex flex-col space-y-10">
    <!-- main -->
    <section
      class="giro__container flex flex-col md:flex-row md:justify-between sm:space-x-8 md:space-x-12 text-subtle"
    >
      <div class="flex-1 md:max-w-xs lg:max-w-sm flex flex-col items-center md:items-start space-y-6 md:space-y-8">
        <div class="w-40">
          <NuxtImg
            src="/assets/images/logo-unsaturated.svg"
            alt="Logo"
            class="w-full object-cover"
          />
        </div>
        <p class="text-[0.82rem]">{{ $t("footer.summary") }}</p>
        <div class="w-full sm:w-[12rem]">
          <BaseSelect
            :options="ACTIVE_LOCALES"
            :initial-selected-option="initialOption"
            size="sm"
          >
            <template #selected="{ selected }">
              <BaseFlag
                v-if="selected"
                :country-code="selected.countryCode"
                size="lg"
              />
              <span class="block whitespace-nowrap truncate font-medium text-left">
                {{ selected?.title }}
              </span>
            </template>
            <template #option="{ option }">
              <div class="flex items-center gap-2">
                <BaseFlag
                  :country-code="option.countryCode"
                  size="lg"
                />
                <span>{{ option.title }}</span>
              </div>
            </template>
          </BaseSelect>
        </div>
        <FooterColumnSocialMedia class="hidden md:flex lg:hidden" />
      </div>
      <FooterColumnSocialMedia class="md:hidden" />
      <FooterColumn
        :title="$t('footer.popular')"
        :links="[
          { title: $t('page.aviator'), to: { name: 'todo' } },
          { title: $t('page.slots'), to: { name: 'todo' } },
          { title: $t('page.live_casino'), to: { name: 'todo' } },
        ]"
      />
      <FooterColumn
        :title="$t('footer.girobet')"
        :links="[
          { title: $t('page.affiliate_program'), to: { name: 'affiliate-program' } },
          { title: $t('page.faq'), to: { name: 'faq' } },
          { title: $t('page.support'), to: { name: 'support' } },
          { title: $t('page.telegram'), to: { name: 'todo' } },
        ]"
      />
      <FooterColumn
        :title="$t('footer.legal')"
        :links="[
          { title: $t('page.betting_terms'), to: { name: 'betting-terms' } },
          { title: $t('page.terms'), to: { name: 'terms' } },
          { title: $t('page.privacy'), to: { name: 'privacy' } },
          { title: $t('page.aml_kyc'), to: { name: 'aml-kyc' } },
          { title: $t('page.responsible_gaming'), to: { name: 'responsible-gaming' } },
        ]"
      />
      <FooterColumnSocialMedia class="hidden lg:flex" />
    </section>

    <section class="giro__container">
      <GridHorizontal
        class="w-full"
        :data="Array(20).fill(0)"
        :gap="1"
        :columns="{ sm: 3.5, md: 5.5, lg: 6.5, xl: 7.5 }"
        aspect-ratio="16/9"
      >
        <template #default>
          <div class="w-full h-full bg-emphasis" />
        </template>
      </GridHorizontal>
    </section>

    <section class="giro__container relative flex flex-col text-subtle">
      <div class="flex flex-col items-center space-y-5 md:space-y-8">
        <div class="max-w-[42rem] lg:max-w-[52rem] text-[0.7rem] sm:text-center">
          {{ $t("footer.legal_notice") }}
        </div>
        <div class="text-center text-[0.82rem]">
          {{ $t("footer.copyright", { year }) }}
        </div>
      </div>
      <BaseButton
        variant="secondary"
        size="xl"
        class="px-3 my-6 w-full md:m-0 md:w-auto md:absolute md:right-6 md:bottom-0"
        @click="scrollToTop"
      >
        <Icon
          name="lucide:chevron-up"
          size="26"
        />
      </BaseButton>
    </section>
  </footer>
</template>
