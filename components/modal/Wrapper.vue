<script setup lang="ts">
type ModalType = "deposit" | "withdraw";

const { isDesktop } = useDevice();

const emit = defineEmits(["update:opened"]);

const props = defineProps<{
  opened: boolean;
  type: ModalType;
}>();

const opened = computed({
  get: () => props.opened,
  set: (value: boolean) => emit("update:opened", value),
});
const image = ref(true);

const imageSrc = computed(() => {
  const name = isDesktop ? "wheel-2" : "wheel";
  return `/assets/images/${name}.png`;
});

const showInfo = (value: boolean) => {
  image.value = !value;
};

const reset = () => {
  image.value = true;
};

const close = () => {
  opened.value = false;
  reset();
};
</script>

<template>
  <BaseDialog
    v-bind="$attrs"
    v-model:opened="opened"
    :close="image"
    size="2xl"
    @close="reset"
  >
    <div class="flex flex-col overflow-auto h-full">
      <div
        v-if="image"
        class="relative w-full h-40 sm:h-[200px]"
      >
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
      <WrapperDeposit v-if="type === 'deposit'" />
      <WrapperWithdraw
        v-else-if="type === 'withdraw'"
        @show:info="showInfo"
        @click:close="close"
      />
    </div>
  </BaseDialog>
</template>
