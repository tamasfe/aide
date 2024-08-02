<script setup lang="ts">
import {
  PhMagnifyingGlass,
  PhList,
  PhLightning,
  PhHeadphones,
  PhGift,
} from "@phosphor-icons/vue";

const { t } = useI18n();

const emit = defineEmits([
  "click:menu",
  "click:hot",
  "click:search",
  "click:support",
  "click:promos",
]);
</script>

<template>
  <div
    class="giro__mobile-menu block z-10 sm:hidden sticky bottom-0 left-0 w-full bg-subtle text-subtle"
  >
    <div
      class="flex items-center justify-between pt-2.5 px-4 pb-2 text-subtle font-bold"
    >
      <button
        class="inline-flex flex-col justify-center items-center outline-none"
        type="button"
        @click="emit('click:menu')"
      >
        <PhList :size="24" />
        <p>{{ t("menu") }}</p>
      </button>
      <button
        class="inline-flex flex-col justify-center items-center outline-none"
        type="button"
        @click="emit('click:hot')"
      >
        <PhLightning :size="24" />
        <p>{{ t("hot") }}</p>
      </button>
      <button
        class="inline-flex flex-col justify-center items-center outline-none"
        type="button"
        @click="emit('click:search')"
      >
        <PhMagnifyingGlass :size="24" />
        <p>{{ t("search") }}</p>
      </button>
      <button
        class="inline-flex flex-col justify-center items-center outline-none"
        type="button"
        @click="emit('click:support')"
      >
        <PhHeadphones :size="24" />
        <p>{{ t("support") }}</p>
      </button>
      <button
        class="inline-flex flex-col justify-center items-center outline-none"
        type="button"
        @click="emit('click:promos')"
      >
        <PhGift :size="24" />
        <p>{{ t("promos") }}</p>
      </button>
    </div>
  </div>
</template>
