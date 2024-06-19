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
  const name = isDesktop ? "wheel-desktop" : "wheel";
  return `/assets/images/${name}.png`;
});
</script>

<template>
  <BaseDialog
    v-bind="$attrs"
    v-model:opened="opened"
    size="6xl"
  >
    <div class="flex flex-col sm:flex-row overflow-auto h-full">
      <div class="flex-auto sm:flex-1 relative w-full sm:w-auto h-40 sm:h-auto">
        <div
          class="absolute top-1/2 sm:top-20 -translate-y-1/2 sm:translate-y-0 left-4 sm:left-1/2 sm:-translate-x-1/2 text-lg sm:text-4xl font-black italic sm:leading-[3rem]"
        >
          <p class="text-brand-yellow text-sm sm:text-2xl">EXCLUSIVE</p>
          <p class="font-extrabold text-xl sm:text-5xl">PRE-RELEASE</p>
          <p class="font-extrabold text-xl sm:text-5xl text-nowrap">
            FROM WILDJACK
          </p>
          <p class="font-extrabold">
            <span class="text-brand-yellow">+100</span> FREE SPINS
          </p>
        </div>
        <NuxtImg
          :src="imageSrc"
          alt="Wheel"
          class="object-cover w-full h-full sm:rounded-l-default"
        />
      </div>
      <div class="flex-auto sm:flex-1 flex flex-col gap-2 sm:gap-0 py-2">
        <div class="inline-flex justify-center py-2 sm:pt-10">
          <IconsLogo />
        </div>
        <div class="px-6 sm:py-6">
          <FormRegisterBrazil />
        </div>
      </div>
    </div>
  </BaseDialog>
</template>
