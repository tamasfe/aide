<script setup lang="ts">
const { t } = useI18n();
const siteStore = useSiteStore();
const { $dependencies } = useNuxtApp();

useHead({
  title: t("page.home", { siteName: siteStore.currentSite.name }),
});

const currentTab = ref("lobby");
const menuTabs = ref([
  { value: "lobby", iconName: "lucide:home", label: t(`home_page.category_tabs.lobby`) },
  { value: "featured", iconName: "lucide:coins", label: t(`category.featured`) },
  { value: "table", iconName: "lucide:files", label: t(`category.table`) },
  { value: "live", iconName: "lucide:users", label: t(`category.live`) },
]);

const queryGameCategories = async () => $dependencies.games.ui.searchGameCategoriesByGroup.handle("home", true);
</script>

<template>
  <NuxtLayout name="carousel">
    <div class="giro__container giro__sections">
      <WinningNowTicker />

      <Tabs v-model="currentTab" class="relative space-y-[var(--giro-section-gap-sm)] md:space-y-[var(--giro-section-gap-lg)]">
        <TabsList :sticky-on-mobile="true" class="md:hidden">
          <TabsTrigger
            v-for="tab in menuTabs"
            :key="tab.value"
            :is-active="tab.value === currentTab"
            :value="tab.value"
            class="space-x-2"
          >
            <BaseIcon :name="tab.iconName" :size="14" />
            <span>{{ toSentenceCase(tab.label) }}</span>
          </TabsTrigger>
        </TabsList>

        <SearchPopover class="hidden md:flex items-stretch w-full">
          <template #prefix>
            <TabsList :sticky-on-mobile="true">
              <TabsTrigger
                v-for="tab in menuTabs"
                :key="tab.value"
                :is-active="tab.value === currentTab"
                :value="tab.value"
                class="space-x-2"
              >
                <BaseIcon :name="tab.iconName" :size="14" />
                <span>{{ toSentenceCase(tab.label) }}</span>
              </TabsTrigger>
            </TabsList>
          </template>
        </SearchPopover>

        <TabsContent value="lobby" class="giro__sections">
          <UseAsyncData
            id="home-page-game-categories"
            :fetch-items="queryGameCategories"
            :wait-for-server-side-rendering="true"
            :defer-client-side-loading="true"
          >
            <template #default="{ items }">
              <GridHorizontalGames
                v-for="category in items"
                :key="category.identifier"
                :category-identifier="category.identifier"
                :initial-games="category.games ?? undefined"
              />
            </template>
            <template #loading>
              <GridHorizontalGamesLoading />
              <GridHorizontalGamesLoading />
              <GridHorizontalGamesLoading />
            </template>
          </UseAsyncData>

          <GridHorizontalProviders />
        </TabsContent>

        <TabsContent
          v-for="tab in menuTabs.filter(tab => tab.value !== 'lobby')"
          :key="tab.value"
          :value="tab.value"
        >
          <GridVerticalGames
            :title="tab.label"
            :category-identifier="tab.value"
            :provider-identifier="null"
          />
        </TabsContent>
      </Tabs>

      <WinningNowTabs />
    </div>
  </NuxtLayout>
</template>
