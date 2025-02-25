<script setup lang="ts">
// DESIGN STATUS:       ✴️
//   * logos for payment providers
// ARCHITECTURE STATUS: ✴️
//   * logo should be refactored out like the <AppHeader> component
// TRANSLATION STATUS:  ✅
const siteStore = useSiteStore();

const year = ref(new Date().getFullYear());

const logos = [
  {
    src: siteStore.getAssetPath("images/logos/play-responsibly.svg"),
    alt: "footer.play_responsibly",
    key: "play-responsibly",
  },
  {
    src: siteStore.getAssetPath("images/logos/responsible-gaming.svg"),
    alt: "footer.responsible_gaming",
    key: "responsible-gaming",
  },
];

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>

<template>
  <footer class="mt-8 pt-6 md:py-12 bg-subtle flex flex-col space-y-10">
    <!-- main -->
    <section
      class="giro__container flex flex-col md:flex-row md:justify-between sm:space-x-8 md:space-x-12 text-subtle"
    >
      <div class="flex-1 md:max-w-xs lg:max-w-sm flex flex-col items-center md:items-start space-y-6 md:space-y-8">
        <div class="w-40">
          <NuxtImg
            :src="siteStore.getAssetPath('images/logos/logo-unsaturated.svg')"
            alt="Logo"
            class="w-full object-cover"
          />
        </div>
        <p>{{ $t("footer.summary", { siteName: siteStore.site.name }) }}</p>
        <div class="w-full">
          <LocaleSelect class="sm:w-[12rem]" />
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
        :title="siteStore.site.name"
        :links="[
          { title: $t('page.affiliate_program'), to: { name: 'affiliate-program' } },
          { title: $t('page.faq'), to: { name: 'faq' } },
          { title: $t('page.support'), onClick: () => $dependencies.common.asyncMessagePublisher.emit('girobet:commands:modals:open-live-chat', {}) },
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
        :data="logos"
        :gap="1"
        :columns="{ sm: 3.5, md: 5.5, lg: 6.5, xl: 7.5 }"
        aspect-ratio="16/9"
      >
        <template #default="{ item }">
          <div class="w-full h-full">
            <NuxtImg
              :src="item.src"
              :alt="$t(item.alt)"
              class="w-full h-full"
            />
          </div>
        </template>
      </GridHorizontal>
    </section>

    <section class="giro__container relative flex flex-col text-subtle">
      <div class="flex flex-col items-center space-y-5 md:space-y-8">
        <div class="max-w-[42rem] lg:max-w-[52rem] text-sm sm:text-center">
          {{ $t("footer.legal_notice") }}
        </div>
        <div class="text-center text-sm">
          {{ $t("footer.copyright", { year, siteName: siteStore.site.name }) }}
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
    </section>
  </footer>
</template>
