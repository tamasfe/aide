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
</script>

<template>
  <footer class="px-4 sm:px-10 py-6 bg-subtle flex flex-col space-y-10">
    <!-- info -->
    <section
      class="flex flex-col lg:flex-row space-y-6 lg:space-x-24 text-subtle"
    >
      <div class="flex-1 lg:flex-none lg:w-72 flex flex-col space-y-6">
        <div class="w-40 h-8">
          <NuxtImg
            src="/assets/images/logo-unsaturated.svg"
            alt="Logo"
            class="w-full h-full object-cover"
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
          class="w-full lg:w-auto"
        >
          <template #prefix>
            <BaseFlag
              :key="language"
              :code="getFlag(language)"
              size="l"
            />
          </template>
          <template #option="{ option }">
            <div class="flex items-center space-x-4">
              <BaseFlag
                :code="getFlag(option.value as string)"
                size="l"
              />
              <span>{{ option.title }}</span>
            </div>
          </template>
        </BaseSelect>
      </div>
      <WrapperSocialMediaLogos class="lg:hidden" />
      <WrapperFooterColumn
        section="Legal"
        :options="[
          { title: 'Terms and Conditions', to: '/terms' },
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
      <WrapperSocialMediaLogos class="flex-1 hidden lg:flex" />
    </section>
    <!-- logos -->
    <section>logos here</section>
    <!-- trademark -->
    <section
      class="flex items-center flex-col lg:flex-row justify-between space-x-4 space-y-4 text-sm text-subtle"
    >
      <p class="max-w-4xl">
        Prior to engaging in any online gambling activities on our platform, it
        is imperative to verify that such actions are legally permissible within
        your jurisdiction. It is your responsibility to ascertain and adhere to
        the laws and regulations governing online gambling in your country or
        region.
      </p>
      <p>©2024 GIROBET ALL RIGHTS RESERVED</p>
      <button
        type="button"
        class="outline-none w-full lg:w-auto bg-emphasis p-3 rounded-default text-subtle inline-flex justify-center"
      >
        <PhCaretUp :size="24" />
      </button>
    </section>
  </footer>
</template>
