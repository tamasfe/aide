<script setup lang="ts">
const { t } = useI18n();
const open = ref(true);

// DESIGN STATUS:       ✴️
//   * hide the scrollbar like on bet7k
// ARCHITECTURE STATUS: ✴️
//   * sidebar needs to close after clicking a link
// TRANSLATION STATUS:  ✴️
//   * translate final menu items

const links = [
  {
    title: "Casino",
    icon: "lucide:cherry",
    children: [
      {
        title: "Aviator",
        icon: "lucide:plane",
        to: "/aviator",
      },
      {
        title: "Fortune Tiger",
        icon: "lucide:circle-dollar-sign",
        to: "/aviator",
      },
    ],
  },
  {
    title: "Casino",
    icon: "lucide:cherry",
    children: [
      {
        title: "Aviator",
        icon: "lucide:plane",
        to: "/aviator",
      },
      {
        title: "Fortune Tiger",
        icon: "lucide:circle-dollar-sign",
        to: "/aviator",
      },
    ],
  },
  {
    title: "Support",
    icon: "lucide:headset",
    to: "/support",
  },
  {
    title: "Support",
    icon: "lucide:headset",
    to: "/support",
  },
  {
    title: "Support",
    icon: "lucide:headset",
    to: "/support",
  },
  {
    title: "Support",
    icon: "lucide:headset",
    to: "/support",
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
      class="no-scrollbar min-w-[20rem] flex flex-col overflow-y-auto space-y-2"
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
