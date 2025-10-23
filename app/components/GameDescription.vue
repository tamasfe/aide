<script setup lang="ts">
import type { Game } from "~/modules/games/domain/Game";

const { t } = useI18n();

// DESIGN STATUS           ✅
// ARCHITECTURE STATUS:    ✴️
//   * we might need to check how softswiss handles multiple languages for the description

// NOTE the entire bottom section might not come from the game API but would be a custom description we add ourself for the most popular games
const url = useRequestURL();
const siteStore = useSiteStore();

defineProps({
  game: {
    type: Object as PropType<Game>,
  },
  authenticated: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "maximize"): void;
}>();
</script>

<template>
  <div class="p-3 pb-4 md:p-4 lg:p-6 gap-4 md:gap-6 flex flex-row rounded">
    <div class="grid grid-cols-[auto,1fr] md:grid-cols-[auto,1fr,auto] w-full md:grid-rows-[min-content,1fr] gap-4 md:gap-6">
      <div class="md:row-span-2 order-3 md:order-none">
        <div class="flex items-center justify-center rounded overflow-hidden border border-muted/5 aspect-[3/4] w-24 md:w-32">
          <GameImage
            v-if="game"
            :identifier="game.identifier"
            class="block w-full object-cover transition-transform transform md:hover:scale-105 cursor-pointer"
          />
          <BaseSkeleton v-else class="w-full h-full" :loading="true" />
        </div>
      </div>
      <div class="order-4 md:order-none">
        <h2 v-if="game" class="text-2xl mb-2">
          {{ game.name }}
        </h2>
        <BaseSkeleton v-else class="h-8 w-1/3 mb-2" :loading="true" />

        <div class="flex items-center flex-wrap gap-2">
          <template v-if="game">
            <NuxtLinkLocale
              v-for="categoryIdentifier in game.categories"
              :key="String(categoryIdentifier)"
              :to="{
                name: 'categories-identifier',
                params: {
                  identifier: String(categoryIdentifier),
                },
              }"
            >
              <button
                class="bg-white/5 backdrop:saturate-200 rounded px-2 py-0.5 text-subtle hover:text-default"
              >
                {{ t(`category.${categoryIdentifier}`) }}
              </button>
            </NuxtLinkLocale>
          </template>
          <template v-else>
            <BaseSkeleton class="h-6 w-14" :loading="true" />
            <BaseSkeleton class="h-6 w-28" :loading="true" />
          </template>
        </div>
      </div>

      <div
        class="
          order-1
          md:order-none
          col-span-full
          md:col-span-1
          self-start
          w-full
          flex
          justify-between
          md:justify-end
          items-center
          text-subtle
          font-semibold
          gap-4
        "
      >
        <ButtonShare
          v-if="game"
          :subject="$t('play.share_subject', { siteName: siteStore.currentSite.name })"
          :body="$t('play.share_body', { game: game.name, siteName: siteStore.currentSite.name })"
          :url="url.toString()"
          class="hover:text-subtle-light"
        />

        <BaseSkeleton v-else class="h-8 w-8" :loading="true" />

        <GameVotes
          v-if="game"
          :authenticated="authenticated"
          :game-identifier="game.identifier"
        />

        <BaseSkeleton v-else class="h-8 w-28" :loading="true" />

        <BaseButton
          v-if="authenticated"
          variant="ghost"
          size="ghost"
          class="hidden md:flex flex-row gap-1 items-center md:hover:text-subtle-light p-3 -m-2"
          @click="emit('maximize')"
        >
          <BaseIcon
            name="lucide:maximize"
            :size="20"
          />
        </BaseButton>
      </div>

      <div
        v-if="game && game.description"
        class="text-subtle col-span-2 order-4 md:order-none"
      >
        {{ game.description }}
      </div>
    </div>
  </div>
</template>
