<!-- A lot of in common with the Log/Reg modal check if it can be refactored -->
<script setup lang="ts">
import { PhCircleNotch } from "@phosphor-icons/vue";

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

type Step = "deposit" | "pix" | "loading";

const step = ref<Step>("deposit");

const gotoStep = (stepName: Step) => {
  step.value = stepName;
};

const generatePayment = () => {
  // do some logic here based on users region/payment method etc...
  gotoStep("loading");
  setTimeout(() => {
    gotoStep("pix");
  }, 2000);
};
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
        <h2
          v-if="step === 'deposit'"
          class="self-start text-2xl font-bold"
        >
          Make a deposit
        </h2>
        <FormDeposit
          v-if="step === 'deposit'"
          @submit="generatePayment"
        />
        <div
          v-else-if="step === 'loading'"
          class="w-full h-[200px] flex items-center justify-center"
        >
          <PhCircleNotch
            :size="40"
            class="text-subtle animate-spin"
          />
        </div>
        <FormDepositPix
          v-else-if="step === 'pix'"
          :value="150000000"
          pix="00001230120301203102314br.gov.bcb.pix24hjashj"
          qr="/assets/images/qr.gif"
          @click:back="gotoStep('deposit')"
        />
      </div>
    </div>
  </BaseDialog>
</template>
