<script setup lang="ts">
import { PhCircleNotch } from "@phosphor-icons/vue";

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
</template>
