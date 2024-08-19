<script setup lang="ts">
import {
  PhCornersOut,
  PhThumbsDown,
  PhThumbsUp,
  PhWhatsappLogo,
} from "@phosphor-icons/vue";
import { getGameImageUrl } from "~/utils";

const emit = defineEmits(["click:login", "click:register"]);

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
  <div class="flex flex-col rounded-default">
    <div class="relative rounded-t-default bg-emphasis pb-[54.39%]">
      <NuxtImg
        class="absolute top-0 left-0 w-full h-full object-cover rounded-t-default"
        :src="getGameImageUrl(id, 'background')"
        alt=""
      />
      <div
        class="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-default/50 backdrop-blur sm:rounded-t-default"
      >
        <div
          class="flex flex-col items-center space-y-4 sm:space-y-10 px-14 sm:p-0"
        >
          <div class="relative w-full pb-[20.33%]">
            <NuxtImg
              src="/assets/images/logo.svg"
              alt="logo"
              class="absolute top-0 left-0 object-cover w-full h-full"
            />
          </div>
          <div class="flex flex-col space-y-4 w-full">
            <h1 class="text-base xl:text-lg font-bold text-center">
              {{ t("auth.login_to_play") }}
            </h1>
            <div class="flex space-x-4 w-full">
              <BaseButton
                class="bg-subtle hover:bg-emphasis text-subtle px-6 xl:px-8 py-2.5 xl:py-3.5 !text-base !font-semibold"
                big
                type="button"
                @click="emit('click:login', $event)"
              >
                {{ t("auth.login") }}
              </BaseButton>
              <!-- temporary fix -->
              <div class="mb-[0.4rem] flex-1">
                <BaseButton
                  class="w-full inline-flex justify-center py-2.5 xl:py-3.5 px-12 !text-base items-center"
                  variant="primary"
                  big
                  shadow
                  type="button"
                  @click="emit('click:register', $event)"
                >
                  {{ t("auth.register") }}
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
          <h3 class="text-lg font-bold">Potion Spells</h3>
          <p class="text-subtle-light">{{ t("misc.by") }} Pragmatic Play</p>
        </div>
        <div
          class="w-full flex justify-between md:justify-end items-center space-x-8 text-subtle font-semibold"
        >
          <button
            type="button"
            class="outline-none inline-flex items-center space-x-2"
          >
            <div>
              <PhWhatsappLogo :size="26" />
            </div>
            <p>{{ t("misc.share") }}</p>
          </button>
          <button
            type="button"
            class="outline-none inline-flex items-center space-x-2"
          >
            <div>
              <PhThumbsUp :size="26" />
            </div>
            <p>74.88% (2.245)</p>
          </button>
          <button
            type="button"
            class="outline-none inline-flex items-center space-x-2"
          >
            <div>
              <PhThumbsDown :size="26" />
            </div>
          </button>
          <button
            type="button"
            class="outline-none inline-flex items-center space-x-2"
          >
            <div>
              <PhCornersOut :size="26" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
