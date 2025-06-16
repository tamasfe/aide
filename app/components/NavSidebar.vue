<script setup lang="ts">
import { toGameUrlSlug } from "~/modules/games/domain/Game";

// DESIGN STATUS:       ✴️
//   * hide the scrollbar like on bet7k
// ARCHITECTURE STATUS: ✴️
//   * ✅ sidebar needs to close after clicking a link
// TRANSLATION STATUS:  ✴️
//   * translate final menu items

const { $dependencies } = useNuxtApp();
const siteStore = useSiteStore();
const { t } = useI18n();
const open = defineModel("open", { default: false, type: Boolean });

const { afterEach } = useRouter();
afterEach(() => {
  if (open.value) {
    open.value = false;
  }
});

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
const { data: categoriesData } = await useAsyncData("sidebar-category-identifiers", async () => {
  return $dependencies.games.ui.searchGameCategoriesByGroup.handle("sidebar_menu", false);
},
{ lazy: DEFER_CLIENT_SIDE_LOADING, server: ENABLE_SERVER_SIDE_RENDERING },
);

const links = [
  {
    title: "Casino",
    icon: "emojione-v1:cherries",
    children: [
      {
        title: t("page.games"),
        icon: "emojione-v1:palm-tree",
        to: {
          name: "games",
        },
      },
      {
        title: t("page.category", { category: t("category.crash") }),
        icon: "emojione-v1:fire",
        to: {
          name: "categories-id",
          params: { id: "crash" },
        },
      },
      {
        title: t("page.category", { category: t("category.slots") }),
        icon: "emojione-v1:slot-machine",
        to: {
          name: "categories-id",
          params: { id: "slots" },
        },
      },
      {
        title: t("page.category", { category: t("category.roulette") }),
        icon: "emojione-v1:eight-spoked-asterisk",
        to: {
          name: "categories-id",
          params: { id: "roulette" },
        },
      },
      {
        title: t("page.category", { category: t("category.live") }),
        icon: "emojione-v1:woman",
        to: {
          name: "categories-id",
          params: { id: "live" },
        },
      },
      {
        title: "Providers",
        icon: "emojione-v1:diamond-suit",
        to: {
          name: "providers",
        },
      },
      {
        title: "Aviator",
        icon: "emojione-v1:airplane",
        to: {
          name: "todo",
        },
      },
      {
        title: "Fortune Tiger",
        icon: "emojione-v1:tiger",
        to: {
          name: "todo",
        },
      },
      {
        title: "JetX",
        icon: "emojione-v1:rocket",
        to: {
          name: "games-slug",
          params: { slug: toGameUrlSlug(29773842, "JetX") },
        },
      },
    ],
  },
  {
    title: t("side_nav.live_support"),
    icon: "emojione-v1:speech-balloon",
    onClick: () => $dependencies.common.asyncMessagePublisher.emit("frontend:commands:modals:open-live-chat", {}),
  },
  {
    title: t("side_nav.download_app"),
    icon: "emojione-v1:mobile-phone",
    to: {
      name: "download-app",
    },
  },
];

const emptyQuery = ref("");
</script>

<template>
  <BaseDrawer v-model:open="open">
    <template #default="{ close }">
      <div class="h-14 flex justify-end px-5 items-center">
        <div class="flex-1">
          <NuxtImg
            class="object-cover h-6"
            :src="siteStore.getAssetPath('logos/logo.svg')"
            alt="Logo"
          />
        </div>

        <BaseClose
          class="top-2 right-2 -mr-5"
          @close="close"
        />
      </div>

      <div class="no-scrollbar flex flex-col overflow-y-auto px-4">
        <div class="px-0">
          <SearchBar
            v-model="emptyQuery"
            input-size="md"
            @click="$dependencies.common.asyncMessagePublisher.emit('frontend:commands:modals:open-user-interaction-modal', { modal: 'search' })"
          />
        </div>

        <!-- Dynamic links -->
        <div v-if="categoriesData && categoriesData.length" class="mt-2 space-y-2">
          <NavSidebarLink
            v-for="category in categoriesData"
            :key="category.identifier"
            :title="toSentenceCase(category.identifier)"
            :to="{
              name: 'categories',
              params: {
                id: category.identifier,
              },
            }"
            :icon="guessCategoryIcon(category.identifier)"
          />
        </div>

        <!-- Fixed links -->
        <div class="mt-2 space-y-2">
          <template v-for="(link, index) in links">
            <NavSidebarLinkGroup
              v-if="link.children"
              :key="`parent-${index}`"
              :parent="{
                title: link.title,
                icon: link.icon,
              }"
              :children="link.children"
            />
            <div
              v-else
              :key="`link-${index}`"
            >
              <NavSidebarLink
                v-if="link.to"
                :title="link.title"
                :to="link.to"
                :icon="link.icon"
              />
              <BaseButton
                v-if="link.onClick"
                class="py-2 flex items-center text-emphasis hover:text-white"
                type="button"
                variant="ghost"
                @click="link.onClick"
              >
                <BaseIcon
                  v-if="link.icon"
                  :name="link.icon"
                  :size="22"
                  class="flex-shrink-0 text-subtle"
                />
                <div class="w-full ml-4 font-medium">{{ link.title }}</div>
              </BaseButton>
            </div>
          </template>
        </div>
      </div>
    </template>
  </BaseDrawer>
</template>
