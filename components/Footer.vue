<script setup lang="ts">
// DESIGN STATUS:       ✴️
//   * logos for payment providers
// ARCHITECTURE STATUS: ✴️
//   * logo should be refactored out like the <Header> component
// TRANSLATION STATUS:  ✅

const { t } = useI18n();

const language = ref("");

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <footer class="py-2 md:py-12 bg-subtle flex flex-col space-y-10">
    <!-- main -->
    <section
      class="giro__container w-full flex flex-col md:flex-row md:justify-between sm:space-x-8 md:space-x-12 text-subtle"
    >
      <div
        class="flex-1 md:max-w-xs lg:max-w-sm flex flex-col items-center md:items-start space-y-6 md:space-y-8"
      >
        <div class="w-40">
          <NuxtImg
            src="/assets/images/logo-unsaturated.svg"
            alt="Logo"
            class="w-full object-cover"
          />
        </div>
        <p class="text-[0.82rem]">{{ t("footer.summary") }}</p>
        <BaseSelect
          v-model="language"
          :options="[]"
          class="w-full md:w-max"
          wrapper-class="!py-0"
        >
          <template #prefix>
            <BaseFlag
              :country-code="'BR'"
              size="md"
            />
          </template>
          <template #option="{ option }">
            <div class="flex items-center space-x-4">
              <BaseFlag
                :country-code="'BR'"
                size="md"
              />
              <span>{{ option.title }}</span>
            </div>
          </template>
        </BaseSelect>
        <FooterColumnSocialMedia
          class="hidden md:flex lg:hidden"
        />
      </div>
      <FooterColumnSocialMedia
        class="md:hidden"
      />
      <FooterColumn
        :title="t('footer.popular')"
        :links="[
          { title: t('page.aviator'), to: 'TODO' },
          { title: t('page.slots'), to: 'TODO' },
          { title: t('page.live_casino'), to: 'TODO' },
        ]"
      />
      <FooterColumn
        :title="t('footer.girobet')"
        :links="[
          { title: t('page.affiliate_program'), to: '/affiliate-program' },
          { title: t('page.faq'), to: '/faq' },
          { title: t('page.support'), to: '/support' },
          { title: t('page.telegram'), to: 'TODO' },
        ]"
      />
      <FooterColumn
        :title="t('footer.legal')"
        :links="[
          { title: t('page.betting_terms'), to: '/betting-terms' },
          { title: t('page.terms'), to: '/terms' },
          { title: t('page.privacy'), to: '/privacy' },
          { title: t('page.aml_kyc'), to: '/aml-kyc' },
          { title: t('page.responsible_gaming'), to: '/responsible-gaming' },
        ]"
      />
      <FooterColumnSocialMedia
        class="hidden lg:flex"
      />
    </section>

    <!-- logos -->
    <section class="giro__container w-full">logos here</section>

    <!-- legal -->
    <section class="giro__container relative w-full flex flex-col text-subtle">
      <div class="flex flex-col items-center space-y-5 md:space-y-8">
        <p class="max-w-[42rem] lg:max-w-[52rem] text-[0.7rem] sm:text-center">{{ t("footer.legal_notice") }}</p>
        <p class="text-center text-[0.82rem]">{{ t("footer.copyright") }}</p>
      </div>
      <button
        type="button"
        class="mt-6 outline-none w-full md:w-auto bg-emphasis hover:bg-active p-3 rounded-default text-subtle inline-flex justify-center md:absolute right-6 bottom-0"
        @click="scrollToTop"
      >
        <Icon
          name="lucide:chevron-up"
          size="26"
        />
      </button>
    </section>
  </footer>
</template>
