<script setup lang="ts">
import { PhCaretUp } from "@phosphor-icons/vue";

const { t } = useI18n();

const languageOptions = [
  { title: t("languages.english"), value: "en" },
  { title: t("languages.portugese"), value: "pt" },
];

const language = ref("en");

const getFlag = (language: string) => {
  switch (language) {
    case "en":
      return "US";
    case "pt":
      return "BR";
    default:
      return "US";
  }
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <footer class="py-6 md:py-12 bg-subtle flex flex-col space-y-10">
    <!-- info -->
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
        <p>
          {{ t("footer.slogan") }}
        </p>
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
                :code="getFlag(option.value as string)"
                size="m"
              />
              <span>{{ option.title }}</span>
            </div>
          </template>
        </BaseSelect>
      </div>
      <WrapperSocialMediaLogos class="md:hidden" />
      <WrapperFooterColumn
        :section="t('footer.legal')"
        :options="[
          { title: t('footer.terms_of_service'), to: '/terms' },
          { title: t('footer.privacy_policy'), to: '/privacy' },
          { title: t('footer.custom_privacy_notice'), to: '/responsible' },
          { title: t('footer.affiliate_terms_and_conditions'), to: '/cookies' },
        ]"
      />
      <WrapperFooterColumn
        :section="t('footer.for_partners')"
        :options="[
          { title: t('footer.vip_program'), to: '/terms' },
          { title: t('footer.banking'), to: '/privacy' },
          { title: t('footer.security_and_fair_play'), to: '/responsible' },
          { title: t('footer.responsible_gambling'), to: '/cookies' },
        ]"
      />
      <WrapperFooterColumn
        :section="t('menu')"
        :options="[
          { title: t('home'), to: '/' },
          { title: t('games'), to: '/games' },
          { title: t('promotions'), to: '/promotions' },
          { title: t('footer.faq'), to: '/faq' },
          { title: t('footer.contact_us'), to: '/contact' },
        ]"
      />
      <WrapperSocialMediaLogos class="hidden lg:flex" />
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
