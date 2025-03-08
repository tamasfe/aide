<script setup lang="ts">
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

const links = [
  {
    title: "Casino",
    icon: "emojione-v1:cherries",
    children: [
      {
        title: "All Games",
        icon: "emojione-v1:palm-tree",
        to: {
          name: "todo",
        },
      },
      {
        title: "Top 20 in Brazil", // bind "Brazil" to {country} in nuxt/i18n
        icon: "emojione-v1:up-arrow",
        to: {
          name: "todo",
        },
      },
      {
        title: "Crash Games",
        icon: "emojione-v1:fire",
        to: {
          name: "todo",
        },
      },
      {
        title: "Slot Games",
        icon: "emojione-v1:slot-machine",
        to: {
          name: "todo",
        },
      },
      {
        title: "Roulette Games",
        icon: "emojione-v1:eight-spoked-asterisk",
        to: {
          name: "todo",
        },
      },
      {
        title: "Live Casino",
        icon: "emojione-v1:woman",
        to: {
          name: "todo",
        },
      },
      {
        title: "Providers",
        icon: "emojione-v1:diamond-suit",
        to: {
          name: "todo",
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
          name: "todo",
        },
      },
    ],
  },
  {
    title: t("side_nav.live_support"),
    icon: "emojione-v1:speech-balloon",
    onClick: () => $dependencies.common.asyncMessagePublisher.emit("girobet:commands:modals:open-live-chat", {}),
  },
  {
    title: t("side_nav.download_app"),
    icon: "emojione-v1:mobile-phone",
    to: {
      name: "download-app",
    },
  },
];
</script>

<template>
  <BaseDrawer v-model:open="open">
    <template #default="{ close }">
      <div class="h-14 flex justify-end px-5 items-center">
        <div class="flex-1">
          <NuxtImg
            class="object-cover h-6"
            :src="siteStore.getAssetPath('images/logos/logo.svg')"
            alt="Logo"
          />
        </div>

        <BaseClose
          class="top-2 right-2 -mr-5"
          @close="close"
        />
      </div>

      <div class="no-scrollbar flex flex-col overflow-y-auto px-2">
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
              class="px-4 py-2 flex items-center text-emphasis hover:text-white"
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
    </template>
  </BaseDrawer>
</template>
