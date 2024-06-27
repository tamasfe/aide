<script setup lang="ts">
import {
  PhCornersOut,
  PhThumbsDown,
  PhThumbsUp,
  PhWhatsappLogo,
} from "@phosphor-icons/vue";
</script>

<template>
  <div class="sm:py-8">
    <div class="md:px-48">
      <div class="rounded-t-default bg-emphasis h-[520px]" />
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
  </div>
</template>
