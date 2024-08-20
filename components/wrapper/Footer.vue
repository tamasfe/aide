<script setup lang="ts">
import { PhCaretUp } from "@phosphor-icons/vue";
import { ACTIVE_TRANSLATIONS } from "~/constants";
import type { TranslationLanguageOption } from "~/types/options";
import type { Language } from "~/types/constants";

const { t } = useI18n();

const language = ref<Language>("en");

const languageOptions: Array<TranslationLanguageOption>
  = ACTIVE_TRANSLATIONS.map(meta => ({
    title: t(`language.${meta.code}`),
    value: meta.code,
    countryCode: meta.countryCode,
  }));

const getFlag = (code: Language) => {
  return languageOptions.find(option => option.value === code)?.countryCode;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <footer class="py-6 md:py-12 bg-subtle flex flex-col space-y-10">
    <!-- main -->
    <section
      class="giro__container w-full flex flex-col md:flex-row md:justify-between sm:space-x-8 md:space-x-12 text-subtle"
    >
      <div
        class="flex-1 md:flex-none md:max-w-xs lg:max-w-sm flex flex-col items-center md:items-start space-y-6"
      >
        <div class="w-40">
          <NuxtImg
            src="/assets/images/logo-unsaturated.svg"
            alt="Logo"
            class="w-full object-cover"
          />
        </div>
        <p>{{ t("footer.summary") }}</p>
        <BaseSelect
          v-model="language"
          :options="languageOptions"
          class="w-full md:w-max"
          wrapper-class="!py-0"
        >
          <template #prefix>
            <BaseFlag
              :key="language"
              :code="getFlag(language)"
              size="m"
            />
          </template>
          <template #option="{ option }">
            <div class="flex items-center space-x-4">
              <BaseFlag
                :code="getFlag(option.value as Language)"
                size="m"
              />
              <span>{{ option.title }}</span>
            </div>
          </template>
        </BaseSelect>
      </div>
      <WrapperSocialMediaLogos
        :code="language"
        class="md:hidden"
      />
      <WrapperFooterColumn
        :section="t('footer.popular')"
        :options="[
          { title: t('page.aviator'), to: 'TODO' },
          { title: t('page.slots'), to: 'TODO' },
          { title: t('page.live_casino'), to: 'TODO' },
        ]"
      />
      <WrapperFooterColumn
        :section="t('footer.girobet')"
        :options="[
          { title: t('page.affiliate_program'), to: '/affiliate-program' },
          { title: t('page.faq'), to: '/faq' },
          { title: t('page.support'), to: '/support' },
          { title: t('page.telegram'), to: 'TODO' },
        ]"
      />
      <WrapperFooterColumn
        :section="t('footer.legal')"
        :options="[
          { title: t('page.betting_terms'), to: '/betting-terms' },
          { title: t('page.terms'), to: '/terms' },
          { title: t('page.privacy'), to: '/privacy' },
          { title: t('page.aml_kyc'), to: '/aml-kyc' },
          { title: t('page.responsible_gaming'), to: '/responsible-gaming' },
        ]"
      />
      <WrapperSocialMediaLogos
        :code="language"
        class="hidden lg:flex"
      />
    </section>

    <!-- logos -->
    <section class="giro__container w-full">logos here</section>

    <!-- trademark -->
    <section
      class="giro__container w-full flex items-center flex-col md:flex-row justify-between md:space-x-4 space-y-4 text-sm text-subtle"
    >
      <p class="max-w-4xl text-xs">
        {{ t("footer.legal_notice") }}
      </p>
      <p>{{ t("footer.copyright") }}</p>
      <button
        type="button"
        class="outline-none w-full md:w-auto bg-emphasis hover:bg-active p-3 rounded-default text-subtle inline-flex justify-center"
        @click="scrollToTop"
      >
        <PhCaretUp :size="24" />
      </button>
    </section>
  </footer>
</template>
