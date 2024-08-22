<script setup lang="ts">
const open = ref(true);

// DESIGN STATUS:       ✴️
//   * design is awful...... i need to just come back to this or someone with good eye for design
// ARCHITECTURE STATUS: ✴️
//   * sidebar needs to close after clicking a link
// TRANSLATION STATUS:  ✅

const links = [
  {
    title: "Casino",
    icon: "lucide:badge-dollar-sign",
    children: [
      {
        title: "Aviator",
        icon: "lucide:plane",
        to: "/aviator",
      },
    ],
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
      class="min-w-[20rem] flex flex-col overflow-y-auto"
    >
      <template v-for="(link, index) in links">
        <BaseMenuCollapse
          v-if="link.children"
          :key="`parent-${index}`"
          :parent="{
            title: link.title,
            icon: link.icon,
            class: 'ml-4 text-[0.90rem] font-medium text-emphasis hover:text-white',
          }"
          :children="link.children.map(child => ({
            ...child,
            class: 'ml-4 text-[0.90rem] font-medium text-emphasis hover:text-white',
          }))"
        />
        <div
          v-else
          :key="`link-${index}`"
          class="p-4"
        >
          <BaseMenuLink
            :title="link.title"
            :to="link.to"
            :icon="link.icon"
            class="ml-4 text-[0.90rem] font-medium text-emphasis hover:text-white"
          />
        </div>
      </template>
    </div>
  </BaseDrawer>
</template>
