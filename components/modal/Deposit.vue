<!-- A lot of in common with the Log/Reg modal check if it can be refactored -->
<script setup lang="ts">
const emit = defineEmits(["update:opened"]);

const props = defineProps<{
  opened: boolean;
}>();

const { isDesktop } = useDevice();

const opened = computed({
  get: () => props.opened,
  set: (value: boolean) => emit("update:opened", value),
});

const imageSrc = computed(() => {
  const name = isDesktop ? "wheel-2" : "wheel";
  return `/assets/images/${name}.png`;
});
</script>

<template>
  <BaseDialog
    v-bind="$attrs"
    v-model:opened="opened"
    size="2xl"
  >
    <div class="flex flex-col overflow-auto h-full">
      <div class="relative w-full h-40 sm:h-[200px]">
        <div
          class="absolute top-1/2 -translate-y-1/2 left-10 text-lg sm:text-xl font-black italic"
        >
          <p class="text-brand-yellow text-sm sm:text-lg">EXCLUSIVE</p>
          <p class="font-extrabold text-xl">PRE-RELEASE</p>
          <p class="font-extrabold text-xl">FROM WILDJACK</p>
          <p class="font-extrabold">
            <span class="text-brand-yellow">+100</span> FREE SPINS
          </p>
        </div>
        <NuxtImg
          :src="imageSrc"
          alt="Wheel"
          class="object-cover w-full h-full sm:rounded-t-default"
        />
      </div>
      <div class="flex-auto flex flex-col gap-2 p-6">
        <h2 class="self-start text-2xl font-bold">Make a deposit</h2>
        <FormDeposit />
      </div>
    </div>
  </BaseDialog>
</template>
