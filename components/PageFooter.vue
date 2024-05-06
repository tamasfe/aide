<template>
  <div class="flex flex-col items-center w-full top-0 left-0">
    <div class="flex flex-col md:flex-row w-full max-w-[1296px] px-4 md:px-[32px] py-[40px] place-content-between">
      <div class="flex flex-col basis-1/4">
        <div class="mb-6">
          <img
            src="~/assets/images/logo/girobet-logo.svg"
            class="w-[162px]"
            alt="Girobet logo"
          >
        </div>
        <div class="flex gap-x-[24px] items-center">
          <a href="#">
            <IconsSocialsTelegram class="fill-white hover:fill-[#FFE33A] transition-all"/>
          </a>
          <a href="#">
            <IconsSocialsInstagram class="fill-white hover:fill-[#FFE33A] transition-all"/>
          </a>
          <a href="#">
            <IconsSocialsTwitter class="fill-white hover:fill-[#FFE33A] transition-all"/>
          </a>
          <a href="#">
            <IconsSocialsTikTok class="fill-white hover:fill-[#FFE33A] transition-all"/>
          </a>
        </div>
      </div>
      <div class="flex flex-col md:flex-row md:flex-wrap place-content-between basis-2/4 mt-[50px] md:mt-0">
        <div class="flex flex-col pt-1">
          <h5 class="font-montserrat text-white opacity-60 mb-[34px] text-xl font-semibold">
            {{ $t('helpfulLinks') }}
          </h5>

          <NuxtLink
            to="/"
            class="font-montserrat text-white text-base mb-[18px] hover:underline"
          >
            Crash
          </NuxtLink>
          <NuxtLink
            to="/"
            class="font-montserrat text-white text-base mb-[18px] hover:underline"
          >
            Double
          </NuxtLink>
          <NuxtLink
            to="/"
            class="font-montserrat text-white text-base mb-[18px] hover:underline"
          >
            Blaze Mirror
          </NuxtLink>
          <NuxtLink
            to="/"
            class="font-montserrat text-white text-base mb-[18px] hover:underline"
          >
            Fairness
          </NuxtLink>
          <NuxtLink
            to="/"
            class="font-montserrat text-white text-base mb-[18px] hover:underline"
          >
            VIP Club
          </NuxtLink>
        </div>
        <div class="flex flex-col pt-1">
          <h5 class="font-montserrat text-white opacity-60 mb-[34px] text-xl font-semibold">
            {{ $t('helpfulLinks') }}
          </h5>

          <NuxtLink
            to="/"
            class="font-montserrat text-white text-base mb-[18px] hover:underline"
          >
            Terms of Services
          </NuxtLink>
          <NuxtLink
            to="/"
            class="font-montserrat text-white text-base mb-[18px] hover:underline"
          >
            Privacy Policy
          </NuxtLink>
          <NuxtLink
            to="/"
            class="font-montserrat text-white text-base mb-[18px] hover:underline"
          >
            Bonus Terms
          </NuxtLink>
          <NuxtLink
            to="/"
            class="font-montserrat text-white text-base mb-[18px] hover:underline"
          >
            FAQ
          </NuxtLink>
        </div>
        <div class="flex flex-col pt-1">
          <h5 class="font-montserrat text-white opacity-60 mb-[34px] text-xl font-semibold">
            {{ $t('emails') }}
          </h5>

          <div class="mb-[18px]">
            <p class="font-montserrat text-white opacity-35 mb-2 text-base font-semibold">
              {{ $t('support') }}
            </p>
            <a
              href="mailto:example.email@gmail.com"
              class="font-montserrat text-white text-base hover:underline"
            >
              example.email@gmail.com
            </a>
          </div>
          <div class="mb-[18px]">
            <p class="font-montserrat text-white opacity-35 mb-2 text-base font-semibold">
              {{ $t('legal') }}
            </p>
            <a
              href="mailto:example.email@gmail.com"
              class="font-montserrat text-white text-base hover:underline"
            >
              example.email@gmail.com
            </a>
          </div>
          <div class="mb-[18px]">
            <p class="font-montserrat text-white opacity-35 mb-2 text-base font-semibold">
              {{ $t('partners') }}
            </p>
            <a
              href="mailto:example.email@gmail.com"
              class="font-montserrat text-white text-base hover:underline"
            >
              example.email@gmail.com
            </a>
          </div>
        </div>
      </div>
      <div class="flex justify-start md:justify-end items-start basis-1/4">
        <div class="w-full max-w-[138px]">
          <PartialsDropdownSelect
            v-model="model"
            :items="lang"
          />
        </div>
      </div>
    </div>

    <div class="w-full bg-body-secondary-bg py-[45px] flex justify-center">
      <img
        src="~/assets/images/placeholders/partners-logos.png"
        alt="placeholder"
      >
    </div>
    <div class="flex flex-col items-start px-4 md:px-[32px] py-[32px] md:py-[42px] mb-[60px] md:mb-0">
      <p class="inline-block w-full max-w-[1296px] mb-[24px] md:mb-[32px] font-montserrat text-white text-sm opacity-35">
        {{ $t('girobetAbout') }}
      </p>
      <p class="text-white opacity-55 font-montserrat text-xs md:text-medium">
        © {{ new Date().getFullYear() }} GiroBet All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const model = ref({
  label: "English",
  flag: "us",
  value: "en",
});
const lang = [
  {
    label: "English",
    flag: "us",
    value: "en",
  },
  {
    label: "Brazil",
    flag: "br",
    value: "br",
  },
  {
    label: "Spain",
    flag: "es",
    value: "es",
  },
];
</script>
