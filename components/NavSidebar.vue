<script setup lang="ts">
import { PhGridFour, PhHouse, PhStar } from "@phosphor-icons/vue";

const open = ref(false);
const isAuthenticated = ref(false);
</script>

<template>
  <BaseDrawer
    v-model:opened="open"
    position="left"
    :size="size"
    class="px-0.5"
  >
    <template #title>
      <div class="flex items-center justify-between pl-4 max-w-48">
        <IconLogo />
      </div>
    </template>
    <div
      class="min-w-[24rem] flex flex-col gap-4 overflow-y-auto py-1 px-2"
      :style="{ paddingBottom: `${bottomPadding}px` }"
    >
      <FormDeposit v-if="isAuthenticated" />
      <div class="select-none">
        <BaseMenuCollapse
          :parent="{
            title: 'Home',
            value: '/',
            icon: PhHouse,
            iconClass: 'text-subtle',
          }"
          :options="homeGameCategories"
        />
        <BaseMenuCollapse
          :parent="{
            title: 'All Games',
            value: 'all_games',
            icon: PhGridFour,
            iconClass: 'text-subtle',
          }"
          :options="allGameCategories"
        />
        <BaseMenuLink
          class="p-4 text-emphasis"
          title="Promotions"
          value="promotions"
          :icon="PhStar"
          icon-class="text-subtle"
        />
        <BaseMenuLink
          class="p-4 text-emphasis"
          title="VIP"
          value="vip"
          :icon="PhStar"
          icon-class="text-subtle"
        />
        <BaseMenuLink
          class="p-4 text-emphasis"
          title="Recently added"
          value="recently_added"
          :icon="PhStar"
          icon-class="text-subtle"
        />
      </div>
    </div>
  </BaseDrawer>
</template>
