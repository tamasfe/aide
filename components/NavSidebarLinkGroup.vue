<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

type Link = {
  title: string;
  to: string;
  icon?: string;
  class?: HTMLAttributes["class"];
};

const props = defineProps<{
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
      class="flex items-center justify-between cursor-pointer outline-none"
      @click="onToggle"
    >
      <div class="p-2 flex items-center">
        <Icon
          v-if="parent.icon"
          :name="parent.icon"
          class="text-subtle"
          size="24"
        />
        <div :class="props.parent.class">{{ parent.title }}</div>
      </div>
      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="transition-transform transform"
        :class="open ? 'rotate-180' : 'text-subtle rotate-0'"
      >
        <Icon
          name="lucide:chevron-down"
          size="24"
          class="text-subtle"
        />
      </BaseButtonNew>
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
        :class="link.class"
      />
    </div>
  </div>
</template>
