<script setup lang="ts">
import {
  PhCornersOut,
  PhThumbsDown,
  PhThumbsUp,
  PhWhatsappLogo,
} from "@phosphor-icons/vue";
</script>

<template>
  <div class="flex flex-col">
    <div class="relative rounded-t-default bg-emphasis">
      <!-- always cover the full width and height of the parent
and keep the aspect ratio of the image -->
      <NuxtImg
        class="w-full h-full object-cover"
        src="/assets/images/fake-game.png"
        alt=""
      />
      <div
        class="absolute top-0 left-0 w-full h-full flex justify-center items-center"
      >
        <div
          class="flex flex-col items-center space-y-4 lg:space-y-10 max-w-[20.5rem]"
        >
          <div class="relative w-full pb-[20.33%]">
            <NuxtImg
              src="/assets/images/logo.svg"
              alt="logo"
              class="absolute top-0 left-0 object-cover w-full h-full"
            />
          </div>
          <div class="flex flex-col space-y-4">
            <h1 class="text-lg font-bold text-center">
              You need to log in to play.
            </h1>
            <div class="flex space-x-4">
              <BaseButton
                class="bg-subtle text-subtle px-8 py-3.5 !text-base !font-semibold"
                big
              >
                Log In
              </BaseButton>
              <!-- temporary fix -->
              <div class="mb-[0.4rem]">
                <BaseButton
                  class="inline-flex justify-center py-3.5 px-16 !text-base items-center"
                  variant="primary"
                  big
                  shadow
                >
                  Register
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rounded-b-default bg-subtle p-4">
      <div
        class="flex flex-col md:flex-row items-center justify-between space-y-4"
      >
        <div
          class="w-full flex justify-between md:justify-start flex-row md:flex-col items-center md:items-start font-semibold"
        >
          <h3 class="text-xl">Game Name</h3>
          <p class="text-emphasis">By Acme Inc</p>
        </div>
        <div
          class="w-full flex justify-between md:justify-end items-center space-x-4 text-subtle font-medium"
        >
          <button
            type="button"
            class="outline-none inline-flex items-center space-x-2"
          >
            <div>
              <PhWhatsappLogo :size="24" />
            </div>
            <p class="hidden lg:block">Share</p>
          </button>
          <button
            type="button"
            class="outline-none inline-flex items-center space-x-2"
          >
            <div>
              <PhThumbsUp :size="24" />
            </div>
            <p class="hidden lg:block">74.88% (2.245)</p>
          </button>
          <button
            type="button"
            class="outline-none inline-flex items-center space-x-2"
          >
            <div>
              <PhThumbsDown :size="24" />
            </div>
          </button>
          <button
            type="button"
            class="outline-none inline-flex items-center space-x-2"
          >
            <div>
              <PhCornersOut :size="24" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
