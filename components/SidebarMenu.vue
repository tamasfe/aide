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

const bottomPadding = ref(0);

onMounted(() => {
  const menu = document.querySelector(".giro__mobile-menu");
  if (menu) {
    bottomPadding.value = menu.clientHeight;
  }
});

watch(
  () => props.opened,
  (value) => {
    if (value) {
      const menu = document.querySelector(".giro__mobile-menu");
      if (menu) {
        bottomPadding.value = menu.clientHeight;
      }
    }
  },
);
</script>

<template>
  <BaseDrawer
    v-model:opened="opened"
    position="left"
    :size="size"
    class="px-2"
  >
    <template #title>
      <div class="flex items-center justify-between pl-4 max-w-48">
        <IconsLogo />
      </div>
    </template>
    <div
      class="w-full flex flex-col gap-4 overflow-y-auto py-1 px-2"
      :style="{ paddingBottom: `${bottomPadding}px` }"
    >
      <FormDeposit />
      <div class="select-none">
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
