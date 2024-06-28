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
        class="w-full h-full object-cover"
        src="/assets/images/fake-game.png"
        alt=""
      />
      <div class="absolute top-0 left-0 w-full h-full p-4">
        <div class="flex flex-col space-y-4">
          <div class="grid grid-cols-3 space-x-2">
            <NuxtImg
              src="https://picsum.photos/200/300"
              alt=""
              class="max-w-[4rem] rounded-default"
            />
            <div class="col-span-2 flex flex-col space-y-4">
              <div class="flex flex-col">
                <h3 class="text-lg">Game Name</h3>
                <p class="text-emphasis">By Acme Inc</p>
              </div>
              <div class="flex items-center space-x-4">
                <button
                  type="button"
                  class="outline-none inline-flex space-x-2 text-emphasis"
                >
                  <div>
                    <PhThumbsUp :size="24" />
                  </div>
                  <p>78% (2.250)</p>
                </button>
                <button
                  type="button"
                  class="outline-none inline-flex text-emphasis"
                >
                  <div>
                    <PhThumbsDown :size="24" />
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-3 items-center space-x-2">
            <button
              type="button"
              class="flex-1 outline-none inline-flex space-x-2 text-emphasis"
            >
              <PhWhatsappLogo :size="24" />
              <p>Share</p>
            </button>
            <BaseButton
              class="col-span-2 w-full"
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
