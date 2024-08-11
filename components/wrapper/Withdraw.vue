<script setup lang="ts">
type Step = "pix" | "info";

const emit = defineEmits(["show:info", "click:close"]);

const step = ref<Step>("pix");

const gotoStep = (stepName: Step) => {
  step.value = stepName;
};

const showInfo = () => {
  gotoStep("info");
  emit("show:info", true);
};

const hideInfo = () => {
  gotoStep("pix");
  emit("show:info", false);
};
</script>

<template>
  <div class="flex-auto flex flex-col gap-2 p-6">
    <h2
      v-if="step === 'pix'"
      class="self-start text-2xl font-bold"
    >
      Withdrawal
    </h2>
    <FormWithdrawPix
      v-if="step === 'pix'"
      @click:info="showInfo"
      @click:cancel="emit('click:close')"
    />
    <WrapperWithdrawInfo
      v-else-if="step === 'info'"
      class="py-4"
      @click:back="hideInfo"
      @click:close="emit('click:close')"
    />
  </div>
</template>
