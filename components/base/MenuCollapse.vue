<script setup lang="ts">
import { PhCaretDown } from "@phosphor-icons/vue";

type CollapseOption = {
  title: string;
  value: string;
  icon?: Component;
  iconClass?: string;
};

defineProps<{
  parent: CollapseOption;
  options: CollapseOption[];
}>();

const opened = ref(false);

const toggle = () => {
  opened.value = !opened.value;
};
</script>

<template>
  <div
    class="p-4 flex flex-col text-emphasis gap-8 rounded-default"
    :class="[opened ? 'bg-subtle' : '']"
  >
    <div
      class="flex items-center justify-between cursor-pointer outline-none"
      @click="toggle"
    >
      <div class="flex items-center gap-2">
        <Component
          :is="parent.icon"
          v-if="parent.icon"
          :size="24"
          :class="parent.iconClass"
        />
        <p>{{ parent.title }}</p>
      </div>
      <button
        type="button"
        class="outline-none transition-transform transform"
        :class="opened ? 'rotate-180' : 'text-subtle rotate-0'"
      >
        <PhCaretDown :size="24" />
      </button>
    </div>
    <div
      v-if="opened"
      class="flex flex-col gap-8"
    >
      <BaseMenuLink
        v-for="option in options"
        :key="option.value"
        :title="option.title"
        :value="option.value"
        :icon="option.icon"
        :icon-class="option.iconClass"
      />
    </div>
  </div>
</template>
