<!-- TODO: Add server side rendering support -->
<script setup lang="ts">
defineProps<{
  data: any[];
}>();

const emit = defineEmits(["click:nextPage", "click:previousPage"]);

const nextPage = () => {
  emit("click:nextPage");
};

const previousPage = () => {
  emit("click:previousPage");
};
</script>

<template>
  <div class="flex flex-col gap-y-4 py-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-x-2">
        <span class="text-[24px] font-bold">Custom Title</span>
        <div
          class="flex items-center gap-x-4 text-3xl font-bold cursor-pointer"
        >
          <div @click="previousPage">
            {{ `<` }}
          </div>
          <div @click="nextPage">
            {{ `>` }}
          </div>
        </div>
      </div>
      <slot name="options" />
    </div>
    <div
      class="flex md:grid gap-4"
      :style="{
        gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`,
      }"
    >
      <slot
        v-for="(item, index) in data"
        :key="index"
        class="bg-subtle p-4 rounded-default"
        :data="item"
      >
        {{ item }}
      </slot>
    </div>
  </div>
</template>
