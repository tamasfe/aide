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

const { data: gameCategories, pending } = useAsyncData("home-page-game-categories", async () => $dependencies.games.ui.searchGameCategoriesByGroup.handle("home", true), { server: true, lazy: true, default: () => [] });
</script>

<template>
  <NuxtLayout name="carousel">
    <div class="max-w-screen-xl mx-auto w-full mb-6 mt-6">
      <WinningNowTicker />
    </div>
    <Tabs v-model="currentTab">
      <div class="sticky md:static z-[5] top-[56px] md:hidden max-w-screen-xl mx-auto w-full mb-6">
        <TabsList class="bg-subtle px-1 w-full">
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
      </div>

      <div class="max-w-screen-xl mx-auto w-full px-4 mb-6">
        <SearchPopover class="hidden md:flex items-stretch ">
          <template #suffix>
            <TabsList class="rounded bg-subtle">
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
      </div>

      <TabsContent value="lobby">
        <template v-if="pending">
          <GridHorizontalGamesLoading class="mb-6" />
          <GridHorizontalGamesLoading class="mb-6" />
          <GridHorizontalGamesLoading class="mb-6" />
        </template>

        <template v-else>
          <GridHorizontalGames
            v-for="category in gameCategories?.filter(cat => cat.games && cat.games.length > 0)"
            :key="category.identifier"
            class="mb-6"
            :category-identifier="category.identifier"
            :initial-games="category.games ?? undefined"
          />
        </template>

        <GridHorizontalProviders class="mb-6" />
      </TabsContent>

      <TabsContent
        v-for="tab in menuTabs.filter(tab => tab.value !== 'lobby')"
        :key="tab.value"
        :value="tab.value"
      >
        <div class="max-w-screen-xl mx-auto w-full px-4">
          <GridVerticalGames
            :title="tab.label"
            :category-identifier="tab.value"
            :provider-identifier="null"
          />
        </div>
      </TabsContent>
    </Tabs>

    <div class="max-w-screen-xl mx-auto w-full px-4">
      <WinningNowTabs />
    </div>
  </NuxtLayout>
</template>
