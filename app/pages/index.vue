<script setup lang="ts">
const { t } = useI18n();
const siteStore = useSiteStore();
definePageMeta({
  layout: "carousel",
});

const localePath = useLocalePath();

useHead({
  title: t("page.home", { siteName: siteStore.currentSite.name }),
});

const menuTabs = computed(() => [
  {
    value: "lobby",
    iconName: "lucide:home",
    label: t(`home_page.category_tabs.lobby`),
    to: localePath({ name: "index" }),
  },
  {
    value: "featured",
    iconName: "lucide:coins",
    label: t(`category.featured`),
    to: localePath({ name: "index-category", params: { category: "featured" } }),
  },
  {
    value: "hot",
    iconName: "lucide:users",
    label: t(`category.hot`),
    to: localePath({ name: "index-category", params: { category: "hot" } }),
  },
  {
    value: "table",
    iconName: "lucide:files",
    label: t(`category.table`),
    to: localePath({ name: "index-category", params: { category: "table" } }),
  },
  {
    value: "slots",
    iconName: "lucide:files",
    label: t(`category.slots`),
    to: localePath({ name: "index-category", params: { category: "slots" } }),
  },
]);
</script>

<template>
  <div>
    <WinningNowTicker class="mb-6" />
    <div class="sticky md:static z-[5] top-14 md:hidden px-4 -mx-4 bg-subtle py-2">
      <nav class="flex gap-2 px-4 -mx-4 scroll-px-4 snap-x scroll-smooth overflow-x-auto no-scrollbar">
        <NuxtLink
          v-for="(route, index) in menuTabs"
          :key="index"
          v-slot="{ isExactActive, href, navigate }"
          :to="route.to"
          custom
        >
          <a
            :href="href"
            class="py-2 px-3 snap-start rounded text-sm md:text-base flex gap-1 items-center"
            :class="[isExactActive ? 'text-emphasis bg-active' : 'text-subtle bg-subtle md:hover:bg-muted']"
            @click="navigate"
          >

            <Icon
              :name="route.iconName"
              :size="14"
              mode="svg"
            />
            {{ route.label }}
          </a>
        </NuxtLink>
      </nav>
    </div>

    <div class="mb-6">
      <SearchPopover class="hidden md:flex items-stretch ">
        <template #suffix>
          <nav class="p-1 flex gap-2">
            <NuxtLink
              v-for="(route, index) in menuTabs"
              :key="index"
              v-slot="{ isExactActive, href, navigate }"
              :to="route.to"
              custom
            >
              <a
                :href="href"
                class="px-5 rounded text-sm md:text-base flex gap-1 items-center"
                :class="[isExactActive ? 'text-emphasis bg-active' : 'text-subtle bg-subtle md:hover:bg-muted']"
                @click="navigate"
              >

                <Icon
                  :name="route.iconName"
                  :size="14"
                  mode="svg"
                />
                {{ route.label }}
              </a>
            </NuxtLink>
          </nav>
        </template>
      </SearchPopover>
    </div>

    <NuxtPage class="mb-6" />

    <WinningNowTabs />
  </div>
</template>
