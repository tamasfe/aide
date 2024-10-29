<script setup lang="ts">
import type { RouteLocationNamedRaw } from "vue-router";

// DESIGN STATUS:       ✅
//   * currently this is hardcoded as a nav sidebar component and not generalized, because theres so much sidebar specific css. when we get a PROPER "collapse" component we can use that
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

type Link = {
  title: string;
  to: RouteLocationNamedRaw;
  icon: string;
};

defineProps<{
  parent: Omit<Link, "to">;
  children: Link[];
}>();

const open = ref(false);

const onToggle = () => {
  open.value = !open.value;
};
</script>

<template>
  <div
    class="select-none flex flex-col text-emphasis rounded-default"
    :class="{ 'bg-subtle': open }"
  >
    <div
      class="flex items-center justify-between cursor-pointer text-emphasis hover:text-white"
      @click="onToggle"
    >
      <div class="p-2 flex items-center">
        <Icon
          v-if="parent.icon"
          :name="parent.icon"
          class="flex-shrink-0 text-subtle"
          size="22"
        />
        <div class="w-full ml-4 text-[0.90rem] font-medium">
          {{ parent.title }}
        </div>
      </div>
      <BaseButton
        variant="ghost"
        size="ghost"
        :class="open ? 'rotate-180' : 'rotate-0'"
      >
        <Icon
          name="lucide:chevron-down"
          size="24"
          class="text-subtle"
        />
      </BaseButton>
    </div>
    <div
      v-if="open"
      class="flex flex-col"
    >
      <NavSidebarLink
        v-for="(link, index) in children"
        :key="index"
        :title="link.title"
        :to="link.to"
        :icon="link.icon"
      />
    </div>
  </div>
</template>
