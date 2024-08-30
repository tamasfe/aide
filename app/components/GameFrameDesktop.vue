<script setup lang="ts">
// DESIGN STATUS:        ✅
//   * NOTE: instead of [70vh] this could be way more fancy and calculate 100vh - height of header - height of menu bar
// ARCHITECTURE STATUS:  ✅

const authenticated = ref(true);
</script>

<template>
  <div class="flex flex-col rounded-default">
    <GameFrameBackdrop
      :authenticated="authenticated"
      class="h-[70vh] rounded-t-default"
    >
      <template #authenticated>
        <GameFrameIframe />
      </template>

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
    </GameFrameBackdrop>

    <div class="rounded-b-default bg-subtle p-3 md:p-4 lg:px-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        <div class="w-full flex justify-between md:justify-start flex-row md:flex-col items-center md:items-start font-semibold">
          <h2 class="text-lg md:text-xl font-semibold">Potion Spells</h2>
          <h3 class="text-subtle-light">Pragmatic Play</h3>
        </div>
        <div class="w-full flex justify-between md:justify-end items-center space-x-8 text-subtle font-semibold">
          <ButtonShare
            :subject="$t('play.share_subject')"
            :body="$t('play.share_body')"
            class="hover:text-subtle-light"
          />

          <GameFrameVotes />

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
