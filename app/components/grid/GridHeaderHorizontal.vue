<script setup lang="ts" generic="T extends unknown[]">
import type { GridHorizontalProps } from "./GridHorizontal.vue";

const props = withDefaults(defineProps<GridHorizontalProps<T>>(), {
  direction: "ltr",
});

const emit = defineEmits<{
  (e: "trigger:load"): void;
}>();

// NOTE: this component is using any for ref template of grid because generic types are not properly supported current version of Vue, so we have to use any type. when https://github.com/vuejs/language-tools/issues/3206 is fixed we SHOULD change this to respective type
// eslint-disable-next-line
const grid = ref<any>(null);

const { isMobile } = useDevice();

const scrollBack = () => {
  if (props.direction === "ltr") {
    grid.value?.scrollBack();
    return;
  }
  grid.value?.scrollForward();
};

const scrollForward = () => {
  if (props.direction === "ltr") {
    grid.value?.scrollForward();
    return;
  }
  grid.value?.scrollBack();
};

const canScrollLeft = computed(() => {
  if (!grid.value) return false;
  return props.direction === "ltr"
    ? !grid.value.isBeginning
    : !grid.value.isEnd;
});

const canScrollRight = computed(() => {
  if (!grid.value) return false;
  return props.direction === "ltr"
    ? !grid.value.isEnd
    : !grid.value.isBeginning;
});
</script>

<template>
  <GridHeader>
    <template #title>
      <div class="flex gap-6">
        <slot name="title" />

        <div
          v-if="!isMobile"
          class="flex items-center gap-x-4 text-3xl font-bold cursor-pointer"
        >
          <BaseButton
            variant="subtle"
            size="sm"
            class="p-1.5"
            :disabled="!canScrollLeft"
            @click="scrollBack"
          >
            <Icon
              name="lucide:chevron-left"
              size="24"
            />
          </BaseButton>
          <BaseButton
            variant="subtle"
            size="sm"
            class="p-1.5"
            :disabled="!canScrollRight"
            @click="scrollForward"
          >
            <Icon
              name="lucide:chevron-right"
              size="24"
            />
          </BaseButton>
        </div>
      </div>
    </template>

    <template #options>
      <slot name="options" />
    </template>

    <GridHorizontal
      ref="grid"
      v-bind="props"
      @trigger:load="emit('trigger:load')"
    >
      <template #default="{ item }">
        <slot :item="item" />
      </template>

      <template #loading>
        <slot name="loading" />
      </template>
    </GridHorizontal>
  </GridHeader>
</template>
