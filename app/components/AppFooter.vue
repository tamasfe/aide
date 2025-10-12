<script setup lang="ts">
// DESIGN STATUS:       ✴️
//   * logos for payment providers
// ARCHITECTURE STATUS: ✴️
//   * logo should be refactored out like the <AppHeader> component
// TRANSLATION STATUS:  ✅
const siteStore = useSiteStore();
const url = useRequestURL();

/**
 * This license number should be given by the backend and transported through the siteStore.getActiveLicense().
 * Until the Backend returns it: we use a hardcoded value.
 */
const LICENSE_NUMBER = "ALSI-082309005-FI4";

const year = ref(new Date().getFullYear());

const logos = [
  {
    src: siteStore.getRelativeAssetPath("logos/play-responsibly.svg"),
    alt: "footer.play_responsibly",
    key: "play-responsibly",
  },
  {
    src: siteStore.getRelativeAssetPath("logos/responsible-gaming.svg"),
    alt: "footer.responsible_gaming",
    key: "responsible-gaming",
  },
];

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <footer class="pt-6 md:py-12 bg-subtle flex flex-col space-y-10 print:hidden">
    <!-- main -->
    <section class="max-w-screen-xl mx-auto w-full px-4 flex flex-col md:flex-row md:justify-between sm:space-x-8 md:space-x-12 text-subtle">
      <div class="flex-1 md:max-w-xs lg:max-w-sm flex flex-col items-center md:items-start space-y-6 md:space-y-8">
        <div class="w-40">
          <NuxtImg
            :src="siteStore.getRelativeAssetPath('logos/logo-unsaturated.svg')"
            alt="Logo"
            class="w-full object-cover"
          />
        </div>
        <p>{{ $t("footer.summary", { siteName: siteStore.currentSite.name }) }}</p>
        <div class="w-full">
          <LocaleSelect class="sm:w-[12rem]" />
        </div>
        <!-- <FooterColumnSocialMedia class="hidden md:flex lg:hidden" /> -->
      </div>
      <!-- <FooterColumnSocialMedia class="md:hidden" /> -->
      <FooterColumn
        :title="$t('footer.popular')"
        :links="[
          // { title: $t('page.aviator'), to: { name: 'todo' } },
          { title: $t('page.slots'), to: { name: 'categories-id', params: { id: 'slots' } } },
          { title: $t('page.live_casino'), to: { name: 'categories-id', params: { id: 'live' } } },
        ]"
      />
      <FooterColumn
        :title="siteStore.currentSite.name"
        :links="[
          // { title: $t('page.affiliate_program'), to: { name: 'affiliate-program' } },
          { title: $t('page.faq'), to: { name: 'faq' } },
          { title: $t('page.support'), onClick: () => $dependencies.common.asyncMessagePublisher.emit('frontend:commands:modals:open-live-chat', {}) },
          // { title: $t('page.telegram'), to: { name: 'todo' } },
        ]"
      />
      <FooterColumn
        :title="$t('footer.legal')"
        :links="[
          { title: $t('page.terms'), to: { name: 'terms' } },
          { title: $t('page.privacy'), to: { name: 'privacy' } },
          { title: $t('page.aml_kyc'), to: { name: 'aml-kyc' } },
          { title: $t('page.responsible_gaming'), to: { name: 'responsible-gaming' } },
        ]"
      />
      <!-- <FooterColumnSocialMedia class="hidden lg:flex" /> -->
    </section>

    <section class="max-w-screen-xl mx-auto w-full px-4 flex flex-col md:flex-row md:items-center gap-4">
      <LicenseAnjouan class="h-12 w-12" />

      <template v-for="item in logos" :key="item.key">
        <NuxtImg
          :src="item.src"
          width="140"
          :alt="$t(item.alt)"
        />
      </template>
    </section>

    <section class="max-w-screen-xl mx-auto w-full px-4 relative flex flex-col text-subtle">
      <div class="flex flex-col items-center space-y-5 md:space-y-8">
        <div class="max-w-[42rem] lg:max-w-[52rem] text-sm sm:text-center">
          <p v-if="siteStore.currentSite.identifier === 'zambabet'">
            This website {{ url.host }} is owned and operated by ORBIT Interactive Tech LTD. registration number: 27465, registered address: 9 Barrack Road, Belize City, Belize..
            Contact us at {{ siteStore.supportEmail }}. {{ url.host }} is licensed and regulated by the Government of the Autonomous Island of Anjouan, Union of Comoros and operates under License No. {{ LICENSE_NUMBER }}. {{ url.host }} has passed all regulatory compliance and is legally authorized to conduct gaming operations for any and all games of chance and wagering.
          </p>
          <p v-else-if="siteStore.currentSite.identifier === 'girobet'">
            This website {{ url.host }} is owned and operated by Hyperion Holdings Ltd. registration number: 46242,
            registered address: 9 Barrack Road, Belize City, Belize. Contact us {{ siteStore.supportEmail }}. Hyperion Holdings Ltd.
            is licensed and regulated by the Government of the Autonomous Island of Anjouan, Union of Comoros and
            operates under License No. ALSI. {{ url.host }} has passed all regulatory compliance and is legally authorized to
            conduct gaming operations for any and all games of chance and wagering.
            <br><br>
            For the purpose of processing payments the transactions are processed by AlphaDominion Services LTD, company
            with Organization number 650965, Record Number 38864127, with head office at Elpidas 8, Pyrgos 4534,
            Limassol, Cyprus.
          </p>
          <br><br>
          {{ $t("footer.legal_notice") }}
        </div>
        <div class="text-center text-sm">
          {{ $t("footer.copyright", { year, siteName: siteStore.currentSite.name }) }}
        </div>
      </div>
      <BaseButton
        variant="secondary"
        size="xl"
        class="px-3 my-6 w-full md:m-0 md:w-auto md:absolute md:right-6 md:bottom-0"
        @click="scrollToTop"
      >
        <BaseIcon
          name="lucide:chevron-up"
          :size="20"
        />
      </BaseButton>

      <section class="!mt-8 max-w-screen-xl mx-auto w-full px-4 flex items-center justify-center" />
    </section>
  </footer>
</template>
