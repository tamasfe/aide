<script setup lang="ts">
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
</script>

<template>
  <BaseDrawer
    v-model:opened="opened"
    position="left"
    :size="size"
  >
    <template #title>
      <div class="flex items-center justify-between">
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
      <BaseButton
        type="button"
        class="w-full inline-flex justify-center"
        variant="emphasis"
        big
      >
        QUICK DEPOSIT
      </BaseButton>
    </div>
  </BaseDrawer>
</template>
