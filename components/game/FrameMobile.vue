<script setup lang="ts">
import {
  PhPlay,
  PhThumbsDown,
  PhThumbsUp,
  PhWhatsappLogo,
} from "@phosphor-icons/vue";
import { getGameImageUrl } from "~/utils";

const { t } = useI18n();

const { params } = useRoute();
const id = Number(params.id as string);

// TODO: make props work
// TODO: replace image with iframe
// TODO: translations
// TODO: slug in url

// const props = defineProps<{
//  name: string;
//  description: string;
//  image: string;
//  likes: number;
//  categories: string[];
// }>();
</script>

<template>
  <div class="flex flex-col">
    <div class="relative rounded-t-default bg-emphasis w-full pb-[75.38%]">
      <NuxtImg
        class="absolute top-0 left-0 w-full h-full object-cover"
        :src="getGameImageUrl(id, 'background')"
        alt=""
      />
      <div
        class="absolute top-0 left-0 w-full h-full py-7 px-8 bg-default/50 backdrop-blur"
      >
        <div class="h-full flex flex-col justify-between space-y-4">
          <div
            class="grid grid-cols-3 place-items-center space-x-8 text-emphasis"
          >
            <NuxtImg
              src="https://picsum.photos/200/300"
              alt=""
              class="w-full rounded-default"
            />
            <div class="col-span-2 w-full flex flex-col space-y-6">
              <div class="flex flex-col">
                <h3 class="text-default text-[1.487rem] font-bold">
                  Potion Spells
                </h3>
                <p class="text-xl text-emphasis font-medium">
                  {{ t("play.by_provider", { provider: "TODO" }) }}
                </p>
              </div>
              <div class="flex items-center space-x-4 font-semibold">
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
          <div class="grid grid-cols-3 gap-x-8 place-items-center">
            <button
              type="button"
              class="outline-none inline-flex space-x-2 text-emphasis"
            >
              <PhWhatsappLogo :size="24" />
              <p class="text-lg font-semibold">{{ t("play.share") }}</p>
            </button>
            <BaseButton
              class="col-span-2 inline-flex justify-center w-full !py-3"
              variant="primary"
              big
              shadow
            >
              <template #prefix>
                <PhPlay :size="24" />
              </template>
              <h1 class="text-2xl">Play</h1>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
