<script setup lang="ts">
import { PhGift, PhGridFour, PhHouse, PhStar } from "@phosphor-icons/vue";

const { isMobile } = useDevice();
const emit = defineEmits(["update:opened"]);
const props = defineProps<{
  opened: boolean;
}>();

const opened = computed({
  get: () => props.opened,
  set: value => emit("update:opened", value),
});

const size = isMobile ? "full" : "lg";
</script>

<template>
  <BaseDrawer
    v-model:opened="opened"
    position="left"
    :size="size"
    class="px-2"
  >
    <template #title>
      <div class="flex items-center justify-between pl-4">
        <IconsLogo />
      </div>
    </template>
    <div class="w-full flex flex-col gap-4">
      <FormDeposit />
      <div>
        <BaseMenuCollapse
          :parent="{
            title: 'Home',
            value: '/',
            icon: PhHouse,
          }"
          :options="[
            {
              title: 'Slots',
              value: 'slots',
              icon: PhStar,
              iconClass: 'text-brand-yellow',
            },
            {
              title: 'Table Games',
              value: 'table_games',
              icon: PhGift,
              iconClass: 'text-brand-yellow',
            },
            {
              title: 'Live Casino',
              value: 'live_casino',
              icon: PhGridFour,
              iconClass: 'text-brand-yellow',
            },
            {
              title: 'Jackpot',
              value: 'jackpot',
              icon: PhGridFour,
              iconClass: 'text-brand-yellow',
            },
          ]"
        />
        <BaseMenuCollapse
          :parent="{
            title: 'All Games',
            value: 'all_games',
            icon: PhGridFour,
          }"
          :options="[
            {
              title: 'Slots',
              value: 'slots',
              icon: PhStar,
              iconClass: 'text-brand-yellow',
            },
            {
              title: 'Table Games',
              value: 'table_games',
              icon: PhGift,
              iconClass: 'text-brand-yellow',
            },
            {
              title: 'Live Casino',
              value: 'live_casino',
              icon: PhGridFour,
              iconClass: 'text-brand-yellow',
            },
            {
              title: 'Jackpot',
              value: 'jackpot',
              icon: PhGridFour,
              iconClass: 'text-brand-yellow',
            },
          ]"
        />
        <BaseMenuLink
          class="p-4 text-emphasis text-lg"
          title="Promotions"
          value="promotions"
          :icon="PhStar"
        />
        <BaseMenuLink
          class="p-4 text-emphasis text-lg"
          title="VIP"
          value="vip"
          :icon="PhStar"
        />
        <BaseMenuLink
          class="p-4 text-emphasis text-lg"
          title="Recently added"
          value="recently_added"
          :icon="PhStar"
        />
      </div>
    </div>
  </BaseDrawer>
</template>
