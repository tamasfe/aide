<template>
  <div class="flex flex-col items-center w-full top-0 left-0">
    <div class="flex flex-col md:flex-row w-full max-w-[1296px] px-4 md:px-[32px] py-[40px] place-content-between">
      <div class="flex flex-col basis-1/4">
        <div class="mb-6">
          <img src="/girobet-logo.svg" class="w-[162px]" alt="Girobet logo">
        </div>
        <div class="flex gap-x-[24px] items-center">
          <a href="#">
            <img src="/socials/telegram.svg" alt="Telegram socials link">
          </a>
          <a href="#">
            <img src="/socials/inst.svg" alt="Instagram socials link">
          </a>
          <a href="#">
            <img src="/socials/twitter.svg" alt="Twitter socials link">
          </a>
          <a href="#">
            <img src="/socials/tiktok.svg" alt="Tiktok socials link">
          </a>
        </div>
      </div>
      <div class="flex flex-col md:flex-row place-content-between basis-2/4 mt-[50px] md:mt-0">
        <div class="flex flex-col pt-1">
          <h5 class="font-montserrat text-white opacity-60 mb-[34px] text-xl font-semibold">Helpful links</h5>

          <NuxtLink to="/" class="font-montserrat text-white text-base mb-[18px]">
            Crash
          </NuxtLink>
          <NuxtLink to="/" class="font-montserrat text-white text-base mb-[18px]">
            Double
          </NuxtLink>
          <NuxtLink to="/" class="font-montserrat text-white text-base mb-[18px]">
            Blaze Mirror
          </NuxtLink>
          <NuxtLink to="/" class="font-montserrat text-white text-base mb-[18px]">
            Fairness
          </NuxtLink>
          <NuxtLink to="/" class="font-montserrat text-white text-base mb-[18px]">
            VIP Club
          </NuxtLink>
        </div>
        <div class="flex flex-col pt-1">
          <h5 class="font-montserrat text-white opacity-60 mb-[34px] text-xl font-semibold">Helpful links</h5>

          <NuxtLink to="/" class="font-montserrat text-white text-base mb-[18px]">
            Terms of Services
          </NuxtLink>
          <NuxtLink to="/" class="font-montserrat text-white text-base mb-[18px]">
            Privacy Policy
          </NuxtLink>
          <NuxtLink to="/" class="font-montserrat text-white text-base mb-[18px]">
            Bonus Terms
          </NuxtLink>
          <NuxtLink to="/" class="font-montserrat text-white text-base mb-[18px]">
            FAQ
          </NuxtLink>
        </div>
        <div class="flex flex-col pt-1">
          <h5 class="font-montserrat text-white opacity-60 mb-[34px] text-xl font-semibold">Emails</h5>

          <div class="mb-[18px]">
            <p class="font-montserrat text-white opacity-35 mb-2 text-base font-semibold">
              Support
            </p>
            <a href="mailto:example.email@gmail.com" class="font-montserrat text-white text-base">
              example.email@gmail.com
            </a>
          </div>
          <div class="mb-[18px]">
            <p class="font-montserrat text-white opacity-35 mb-2 text-base font-semibold">
              Legal
            </p>
            <a href="mailto:example.email@gmail.com" class="font-montserrat text-white text-base">
              example.email@gmail.com
            </a>
          </div>
          <div class="mb-[18px]">
            <p class="font-montserrat text-white opacity-35 mb-2 text-base font-semibold">
              Partners
            </p>
            <a href="mailto:example.email@gmail.com" class="font-montserrat text-white text-base">
              example.email@gmail.com
            </a>
          </div>
        </div>
      </div>
      <div class="flex justify-start md:justify-end items-start basis-1/4">
        <div class="flex items-center rounded px-[14px] py-[9px] bg-[#2F323C] text-white hover:cursor-pointer select-none">
          <img src="/flags/us.png" alt="US flag">
          <span class="mx-2">
            English
          </span>
          <img src="/icons/chevron-down.svg" alt="chevron icon">
        </div>
      </div>
    </div>

    <div class="w-full bg-[#232630] py-[45px] flex justify-center">
      <img src="/partners-logos.png" alt="placeholder">
    </div>
    <div class="flex flex-col items-start px-4 md:px-[32px] py-[32px] md:py-[42px]">
      <p class="inline-block w-full max-w-[1296px] mb-[24px] md:mb-[32px] font-montserrat text-white text-sm opacity-35">
        GiroBet is the first multi-currency online casino where you can play with Bitcoin and other cryptocurrencies, as well as a range of traditional currencies, including rubles, dollars and euros. BitStarz is operated by Dama N.V., registered at Scharlooweg 39, Willemstad, Curacao, registration number 152125, in accordance with the laws of Curacao. Dama N.V. operates under license 8048/JAZ2020-13 issued by Antlephone N.V., authorized by the Government of Curacao. Friolion Ltd. registered at Leandrou, 12A 3086, Limassol, Cyprus, registration number HE 419102, in accordance with the laws of the Republic of Cyprus. Friolion Ltd. is part of the DAMA group of companies. The DAMA group of companies operates under licenses from Curacao (8048/JAZ2020-13). All payments through the Paysafe system are made through Dama N.V. It is the sole responsibility of the player to become familiar with the online casino laws applicable in a particular jurisdiction
      </p>
      <p class="text-white opacity-55 font-montserrat text-sm md:text-medium">
        © {{ new Date().getFullYear() }} GiroBet All rights reserved.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
