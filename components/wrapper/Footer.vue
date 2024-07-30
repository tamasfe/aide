<script setup lang="ts">
import { PhCaretUp } from "@phosphor-icons/vue";

const languageOptions = [
  { title: "English", value: "en" },
  { title: "Português", value: "pt" },
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
          Welcome to The GiroBet Experience the ultimate thrill of online
          gambling with us. Play slots, poker, blackjack, and more. Win big with
          our bonuses and promotions.
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
        section="Legal"
        :options="[
          { title: 'Terms of Use & Service Agreement', to: '/terms' },
          { title: 'Privacy Policy', to: '/privacy' },
          { title: 'Custom Privacy Notice', to: '/responsible' },
          { title: 'Affiliate Terms and Conditions', to: '/cookies' },
        ]"
      />
      <WrapperFooterColumn
        section="For Partners"
        :options="[
          { title: 'VIP Program', to: '/terms' },
          { title: 'Banking', to: '/privacy' },
          { title: 'Security & Fair Play', to: '/responsible' },
          { title: 'Responsible Gambling', to: '/cookies' },
        ]"
      />
      <WrapperFooterColumn
        section="Menu"
        :options="[
          { title: 'Home', to: '/' },
          { title: 'Games', to: '/games' },
          { title: 'Promotions', to: '/promotions' },
          { title: 'FAQ', to: '/faq' },
          { title: 'Contact Us', to: '/contact' },
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
        Prior to engaging in any online gambling activities on our platform, it
        is imperative to verify that such actions are legally permissible within
        your jurisdiction. It is your responsibility to ascertain and adhere to
        the laws and regulations governing online gambling in your country or
        region.
      </p>
      <p>©2024 GIROBET ALL RIGHTS RESERVED</p>
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
