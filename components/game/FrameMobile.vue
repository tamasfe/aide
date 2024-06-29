<script setup lang="ts">
import {
  PhPlay,
  PhThumbsDown,
  PhThumbsUp,
  PhWhatsappLogo,
} from "@phosphor-icons/vue";

console.log("test");
</script>

<template>
  <div class="flex flex-col">
    <div class="relative rounded-t-default bg-emphasis w-full">
      <!-- always cover the full width and height of the parent
and keep the aspect ratio of the image -->
      <NuxtImg
        class="w-full min-h-64 object-cover"
        src="/assets/images/fake-game.png"
        alt=""
      />
      <div class="absolute top-0 left-0 w-full h-full p-6">
        <div class="h-full flex flex-col justify-evenly space-y-4">
          <div class="flex items-center space-x-4 text-emphasis">
            <NuxtImg
              src="https://picsum.photos/200/300"
              alt=""
              class="w-[25%] rounded-default"
            />
            <div class="flex flex-col space-y-4">
              <div class="flex flex-col">
                <h3 class="text-lg font-semibold">Game Name</h3>
                <p class="text-emphasis">By Acme Inc</p>
              </div>
              <div class="flex items-center space-x-4">
                <button
                  type="button"
                  class="outline-none inline-flex items-center space-x-2 text-emphasis"
                >
                  <div>
                    <PhThumbsUp :size="30" />
                  </div>
                  <p class="text-lg">78% (2.250)</p>
                </button>
                <button
                  type="button"
                  class="outline-none inline-flex text-emphasis"
                >
                  <div>
                    <PhThumbsDown :size="30" />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button
              type="button"
              class="w-[25%] outline-none inline-flex space-x-2 text-emphasis"
            >
              <PhWhatsappLogo :size="24" />
              <p>Share</p>
            </button>
            <BaseButton
              class="flex-1 inline-flex justify-center"
              variant="primary"
              big
              shadow
            >
              <template #prefix>
                <PhPlay :size="24" />
              </template>
              Play
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
