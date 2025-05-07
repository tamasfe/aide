<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const { t } = useI18n();
const siteStore = useSiteStore();

useHead({
  title: t("page.home", { siteName: siteStore.site.name }),
});

const currentTab = ref("lobby");
const menuTabs = ref([
  { value: "lobby", iconName: "lucide:home", label: t(`home_page.category_tabs.lobby`) },
  { value: "slots", iconName: "lucide:coins", label: t(`category.slots`) },
  { value: "crash", iconName: "lucide:crosshair", label: t(`category.crash`) },
  { value: "table", iconName: "lucide:files", label: t(`category.table`) },
  { value: "live", iconName: "lucide:users", label: t(`category.live`) },
]);

/**
 * "Lobby" tab contents
 */
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

      <Tabs v-model="currentTab" class="relative space-y-[var(--giro-section-gap-sm)] md:space-y-[var(--giro-section-gap-lg)]">
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
