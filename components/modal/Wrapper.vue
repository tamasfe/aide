<script setup lang="ts">
// const { isDesktop } = useDevice();

const emit = defineEmits(["update:opened"]);

const props = defineProps<{
  opened: boolean;
}>();

const opened = computed({
  get: () => props.opened,
  set: (value: boolean) => emit("update:opened", value),
});
const image = ref(true);

// const imageSrc = computed(() => {
//  const name = isDesktop ? "wheel-2" : "wheel";
//  return `/assets/images/${name}.png`;
// });

const reset = () => {
  image.value = true;
};

const showImage = (value: boolean) => {
  image.value = value;
};

defineExpose({
  reset,
  showImage,
});
</script>

<template>
  <BaseDialog
    v-bind="$attrs"
    v-model:opened="opened"
    :close="image"
    size="2xl"
    class="sm:!rounded-[0.8rem]"
    @close="reset"
  >
    <div class="flex flex-col overflow-auto h-full">
      <div
        v-if="image"
        class="relative w-full pb-[33%]"
      >
        <NuxtImg
          src="/assets/images/wheel-2.png"
          alt="Wheel"
          class="absolute left-0 top-0 object-cover w-full sm:rounded-t-[0.8rem]"
        />
        <div
          class="absolute top-1/2 -translate-y-1/2 left-5 sm:left-10 text-lg sm:text-xl font-black italic"
        >
          <p class="text-brand-yellow text-sm sm:text-lg">EXCLUSIVE</p>
          <p class="font-extrabold text-xl">PRE-RELEASE</p>
          <p class="font-extrabold text-xl">FROM WILDJACK</p>
          <p class="font-extrabold">
            <span class="text-brand-yellow">+100</span> FREE SPINS
          </p>
        </div>
      </div>
      <slot />
    </div>
  </BaseDialog>
</template>
