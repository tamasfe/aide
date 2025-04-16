<script setup lang="ts">
const { t } = useI18n();

// DESIGN STATUS           ✅
// ARCHITECTURE STATUS:    ✴️
//   * we might need to check how softswiss handles multiple languages for the description

// NOTE the entire bottom section might not come from the game API but would be a custom description we add ourself for the most popular games
const { isMobile } = useDevice();
const url = useRequestURL();
const siteStore = useSiteStore();

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
  authenticated: {
    type: Boolean,
    required: true,
  },
  imageUrl: {
    type: [String, null],
    required: true,
  },
  categories: {
    type: Array as PropType<string[]>,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "maximize"): void;
}>();
</script>

<template>
  <div class="p-3 pb-4 md:p-4 lg:p-6 gap-4 md:gap-6 flex flex-row rounded">
    <div class="grid grid-cols-[auto,1fr] md:grid-cols-[auto,1fr,auto] w-full md:grid-rows-[min-content,1fr] gap-x-6 gap-y-8">
      <div class="md:row-span-2 min-w-[100px] order-2 md:order-none">
        <div class="flex items-center justify-center rounded-lg overflow-hidden border border-muted/5">
          <!-- Had to resort to using the native nuxt image component here, instead of our
           game image component to ensure the aspect catio scales correctly with the grid -->
          <GameImage
            v-if="!isMobile"
            :src="imageUrl"
            alt=""
            class="block w-full object-cover aspect-[3/4] transition-transform transform hover:scale-105 cursor-pointer"
          />
        </div>
      </div>
      <div class="order-3 md:order-none">
        <h2 class="text-2xl mb-2">{{ title }}</h2>
        <div class="flex items-center space-x-2">
          <BaseLink
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
              class="rounded px-2 py-0.5"
            >
              {{ t(`category.${categoryIdentifier}`) }}
            </BaseButton>
          </BaseLink>
        </div>
      </div>
      <div class="order-1 col-span-full md:order-none md:col-span-1 self-start w-full flex justify-between md:justify-end items-center text-subtle font-semibold gap-4">
        <ButtonShare
          :subject="$t('play.share_subject', { siteName: siteStore.site.name })"
          :body="$t('play.share_body', { game: title, siteName: siteStore.site.name })"
          :url="url.toString()"
          class="hover:text-subtle-light"
        />

        <GameFrameVotes :authenticated="authenticated" :game-id="id" />

        <BaseButton
          v-if="authenticated"
          variant="ghost"
          size="ghost"
          class="flex flex-row gap-1 items-center hover:text-subtle-light p-3 -m-2"
          @click="emit('maximize')"
        >
          <BaseIcon
            name="lucide:maximize"
            :size="20"
          />
        </BaseButton>
      </div>

      <p
        v-if="description"
        class="text-subtle col-span-2 order-4 md:order-none"
      >
        {{ description }}
      </p>
    </div>
  </div>
</template>
