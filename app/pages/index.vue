<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const { t } = useI18n();
const siteStore = useSiteStore();

useHead({
  title: t("page.home", { siteName: siteStore.site.name }),
});

const currentTab = ref("lobby");

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;
const { data: categories } = await useAsyncData("home-category-identifiers", async () => {
  return $dependencies.games.ui.searchGameCategoriesByGroup.handle("home", true);
},
{ lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);
</script>

<template>
  <NuxtLayout name="carousel">
    <div class="giro__container giro__sections">
      <WinningNowSlider />

      <Tabs v-model="currentTab" class="space-y-6">
        <TabsList class="md:max-w-xs" :sticky-on-mobile="true">
          <TabsTrigger
            :is-active="'lobby' === currentTab"
            value="lobby"
            class="space-x-2"
          >
            <BaseIcon name="lucide:home" :size="14" />
            <span>{{ toSentenceCase($t(`home_page.category_tabs.lobby`)) }}</span>
          </TabsTrigger>

          <TabsTrigger
            :is-active="'slots' === currentTab"
            value="slots"
            class="space-x-2"
          >
            <BaseIcon name="lucide:coins" :size="14" />
            <span>{{ toSentenceCase($t(`category.slots`)) }}</span>
          </TabsTrigger>

          <TabsTrigger
            :is-active="'roulette' === currentTab"
            value="roulette"
            class="space-x-2"
          >
            <BaseIcon name="lucide:circle-dot" :size="14" />
            <span>{{ toSentenceCase($t(`category.roulette`)) }}</span>
          </TabsTrigger>

          <template #suffix>
            <SearchPopover class="hidden md:block w-full" />
          </template>
        </TabsList>

        <TabsContent value="lobby" class="giro__sections">
          <GridHorizontalGames
            v-for="category in categories"
            :key="category.identifier"
            :category-identifier="category.identifier"
            :initial-games="category.games ?? undefined"
          />

          <GridHorizontalProviders />
        </TabsContent>

        <TabsContent value="slots">
          <GridVerticalGames
            title="Slots"
            category-identifier="slots"
            :provider-id="null"
          />
        </TabsContent>

        <TabsContent value="roulette">
          <GridVerticalGames
            title="Roulette"
            category-identifier="roulette"
            :provider-id="null"
          />
        </TabsContent>
      </Tabs>

      <WinningNowTabs />
    </div>
  </NuxtLayout>
</template>
