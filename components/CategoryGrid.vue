<script setup lang="ts" generic="T">
import { PhArrowLeft, PhCaretDown } from "@phosphor-icons/vue";

const emit = defineEmits(["showMore"]);

const onShowMore = () => {
  emit("showMore");
};

const props = defineProps<{
  data: T[];
  max?: number;
}>();

const max = computed(() => {
  return props.max !== undefined ? props.max : props.data.length;
});
</script>

<template>
  <div class="flex flex-col gap-y-4 sm:gap-y-8 py-2">
    <div
      class="flex flex-col gap-y-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-center gap-x-4">
        <div
          class="flex items-center gap-x-4 text-3xl font-bold cursor-pointer"
        >
          <NuxtLink to="/">
            <PhArrowLeft
              class="text-subtle"
              :size="38"
            />
          </NuxtLink>
        </div>
        <div>
          <slot name="title" />
        </div>
      </div>
      <slot name="options" />
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-6 gap-4">
      <div
        v-for="(datapoint, index) in data"
        :key="index"
      >
        <slot :data="datapoint" />
      </div>
    </div>
    <div class="flex justify-center items-center flex-col gap-4 mt-4">
      <div
        class="relative w-1/2 md:w-[20%] lg:w-[15%] h-1.5 rounded-lg bg-emphasis"
      >
        <div
          class="absolute left-0 top-0 h-1.5 bg-text-subtle rounded-lg"
          :style="{ width: `${(data.length / max) * 100}%` }"
        />
      </div>
      <p class="text-emphasis text-medium">{{ data.length }} of {{ max }}</p>
      <BaseButton
        class="bg-emphasis inline-flex justify-center text-subtle hover:text-emphasis w-full sm:w-max !text-base !font-medium !px-4 !py-3 sm:!px-6 sm:!py-2.5 !rounded-md"
        big
        @click="onShowMore"
      >
        <div class="inline-flex items-center gap-x-2">
          <p class="text-xl sm:text-base">Show more</p>
          <div>
            <PhCaretDown :size="20" />
          </div>
        </div>
      </BaseButton>
    </div>
  </div>
</template>
