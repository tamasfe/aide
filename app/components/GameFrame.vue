<script setup lang="ts">
import {
  PhCornersOut,
  PhThumbsDown,
  PhThumbsUp,
  PhWhatsappLogo,
} from "@phosphor-icons/vue";

// DESIGN STATUS:        ✴️
//   * its very likely this component will not come with blurred images and will need a blur overlay on top of a full brightness bg
// ARCHITECTURE STATUS:  ✴️
//   * the [full screen] button needs to work


const authenticated = ref(false);

const { isMobile } = useDevice();
</script>

<template>
  <div class="flex flex-col rounded-default">
    <div class="w-full h-[70vh] relative rounded-t-default bg-emphasis overflow-hidden">
      <GameFrameIframe
        v-if="authenticated"
      />
      <template v-else>
        <NuxtImg
          class="absolute top-0 left-0 w-full h-full object-cover"
          src="/assets/images/games/3.png"
          alt=""
        />
        <div
          class="bg-default/80 backdrop-blur absolute top-0 left-0 w-full h-full flex justify-center items-center"
        >
          <div
            class="flex flex-col items-center gap-4"
          >
            <IconLogo
              class="w-[14rem]"
            />
            <h1 class="text-lg font-semibold text-center">
              {{ $t("play.login_to_play") }}
            </h1>
            <div class="flex gap-4 w-full">
              <BaseButton
                variant="subtle"
                class="px-8"
              >
                {{ $t("button.login") }}
              </BaseButton>
              <BaseButton
                variant="primary"
                class="px-12"
              >
                {{ $t("button.register") }}
              </BaseButton>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="rounded-b-default bg-subtle p-4">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <div class="w-full flex justify-between md:justify-start flex-row md:flex-col items-center md:items-start font-semibold">
          <h2 class="text-lg font-semibold">Potion Spells</h2>
          <h3 class="text-subtle-light">
            {{ $t("play.by_provider", { provider: "TODO" }) }}
          </h3>
        </div>
        <div class="w-full flex justify-between md:justify-end items-center space-x-8 text-subtle font-semibold">
          <ButtonShare
            :subject="$t('play.share_subject')"
            :body="$t('play.share_body')"
            class="hover:text-subtle-light"
          />

          <div class="flex flex-row gap-2 items-center">
            <BaseButton
              variant="ghost"
              size="ghost"
              class="flex flex-row gap-1 items-center hover:text-subtle-light"
            >
              <Icon
                name="lucide:thumbs-down"
                size="24"
              />
            </BaseButton>
            <div class="flex flex-col gap-1 leading-none whitespace-nowrap items-center text-sm text-center justify-center">
              <div>75.2%</div>
              <div class="font-medium">2.425</div>
            </div>
            <BaseButton
              variant="ghost"
              size="ghost"
              class="flex flex-row gap-1 items-center hover:text-subtle-light"
            >
              <Icon
                name="lucide:thumbs-up"
                size="24"
              />
            </BaseButton>
          </div>

          <BaseButton
            v-if="authenticated"
            variant="ghost"
            size="ghost"
            class="flex flex-row gap-1 items-center hover:text-subtle-light"
          >
            <Icon
              name="lucide:maximize"
              size="24"
            />
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
