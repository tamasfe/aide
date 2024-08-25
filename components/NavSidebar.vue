<script setup lang="ts">
const { t } = useI18n();
const open = ref(false);

// DESIGN STATUS:       ✴️
//   * hide the scrollbar like on bet7k
// ARCHITECTURE STATUS: ✴️
//   * sidebar needs to close after clicking a link
// TRANSLATION STATUS:  ✴️
//   * translate final menu items

const links = [
  {
    title: "Casino",
    icon: "emojione-v1:cherries",
    children: [
      {
        title: "All Games",
        icon: "emojione-v1:palm-tree",
        to: "TODO",
      },
      {
        title: "Top 20 in Brazil", // bind "Brazil" to {country} in nuxt/i18n
        icon: "emojione-v1:up-arrow",
        to: "TODO",
      },
      {
        title: "Crash Games",
        icon: "emojione-v1:fire",
        to: "TODO",
      },
      {
        title: "Slot Games",
        icon: "emojione-v1:slot-machine",
        to: "TODO",
      },
      {
        title: "Roulette Games",
        icon: "emojione-v1:eight-spoked-asterisk",
        to: "TODO",
      },
      {
        title: "Live Casino",
        icon: "emojione-v1:woman",
        to: "TODO",
      },
      {
        title: "Providers",
        icon: "emojione-v1:diamond-suit",
        to: "TODO",
      },
      {
        title: "Aviator",
        icon: "emojione-v1:airplane",
        to: "TODO",
      },
      {
        title: "Fortune Tiger",
        icon: "emojione-v1:tiger",
        to: "TODO",
      },
      {
        title: "JetX",
        icon: "emojione-v1:rocket",
        to: "TODO",
      },
    ],
  },
  {
    title: "Live Support",
    icon: "emojione-v1:speech-balloon",
    to: "TODO",
  },
  {
    title: "Aviator",
    icon: "emojione-v1:airplane",
    to: "TODO",
  },
  {
    title: "Fortune Tiger",
    icon: "emojione-v1:tiger",
    to: "TODO",
  },
  {
    title: "Live Casino",
    icon: "emojione-v1:woman",
    to: "TODO",
  },
];
</script>

<template>
  <BaseDrawer
    v-model:open="open"
  >
    <template #title>
      <div class="flex items-center justify-between pt-1 pl-4 max-w-[10rem]">
        <IconLogo />
      </div>
    </template>
    <div
      class="no-scrollbar min-w-[20rem] mt-5 flex flex-col overflow-y-auto space-y-2"
    >
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
            :title="link.title"
            :to="link.to"
            :icon="link.icon"
          />
        </div>
      </template>
    </div>
  </BaseDrawer>
</template>
