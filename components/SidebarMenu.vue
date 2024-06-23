<script setup lang="ts">
import { PhGift, PhGridFour, PhStar } from "@phosphor-icons/vue";

const { isMobile } = useDevice();
const emit = defineEmits(["update:opened"]);
const props = defineProps<{
  opened: boolean;
}>();

const opened = computed({
  get: () => props.opened,
  set: value => emit("update:opened", value),
});

const deposit = ref("10,00");

const size = isMobile ? "full" : "lg";

const quickDepositAmounts = ["10.00", "50.00", "100.00"];
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
      <FormControl
        v-model="deposit"
        type="number"
        wrapper-class="bg-subtle text-lg"
        input-class="font-semibold"
        placeholder="Deposit"
      >
        <template #prefix>
          <IconsRSGreen />
        </template>
        <template #suffix>
          <div class="flex items-center space-x-2">
            <BaseFlag code="BR" />
            <span class="text-emphasis text-lg font-semibold">BRL</span>
          </div>
        </template>
      </FormControl>
      <div class="flex items-center gap-2">
        <button
          v-for="amount of quickDepositAmounts"
          :key="amount"
          type="button"
          class="flex-1 flex items-center bg-subtle outline-none space-x-2 p-3 rounded-default cursor-pointer"
        >
          <IconsRSGreen />
          <p class="font-semibold">{{ amount }}</p>
        </button>
      </div>
      <BaseButton
        type="button"
        class="w-full inline-flex justify-center"
        variant="emphasis"
        big
      >
        QUICK DEPOSIT
      </BaseButton>
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
    </div>
  </BaseDrawer>
</template>
