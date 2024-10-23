<script setup lang="ts">
const { t } = useI18n();

// DESIGN STATUS           ✅
// ARCHITECTURE STATUS:    ✴️
//   * we might need to check how softswiss handles multiple languages for the description

// NOTE the entire bottom section might not come from the game API but would be a custom description we add ourself for the most popular games
const { isMobile } = useDevice();

defineProps({
  description: {
    type: [String, null],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  categories: {
    type: Array as PropType<string[]>,
    required: true,
  },
});
</script>

<template>
  <div class="p-3 pb-4 md:p-4 lg:p-6 gap-4 md:gap-6 flex flex-row rounded-default">
    <div class="hidden sm:block min-w-[8rem]">
      <GamesImageLoader
        v-if="!isMobile"
        :game-id="id"
        class="rounded-default"
      />
    </div>
    <div class="flex flex-col gap-4 sm:gap-6">
      <div class="flex flex-row gap-4">
        <GamesImageLoader
          v-if="!isMobile"
          :game-id="id"
          class="sm:hidden w-[3rem] rounded-default"
        />
        <div class="flex flex-col gap-2">
          <h2 class="text-xl font-semibold">{{ title }}</h2>
          <div class="flex items-center space-x-2">
            <NuxtLink
              v-for="categoryIdentifier in categories"
              :key="categoryIdentifier"
              :to="{
                name: 'categories-id',
                params: {
                  id: categoryIdentifier,
                },
              }"
            >
              <BaseButton
                variant="secondary"
                size="ghost"
                class="rounded-default px-2 py-0.5"
              >
                {{ t(`category.${categoryIdentifier}`) }}
              </BaseButton>
            </NuxtLink>
          </div>
        </div>
      </div>
      <p
        v-if="description"
        class="text-subtle"
      >
        {{ description }}
      </p>
    </div>
  </div>
</template>
