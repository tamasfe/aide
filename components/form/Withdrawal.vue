<script setup lang="ts">
import type { SupportedCountryCode } from "@/types/constants";

const { t } = useI18n();

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✴️

const loading = ref(false);
const countryCode = ref<SupportedCountryCode>("BR");
const currency = ref("BRL");

const showLimits = ref(false);

const onToggleLimits = () => {
  showLimits.value = !showLimits.value;
};
</script>

<template>
  <BaseForm>
    <div class="flex justify-between">
      <div class="mb-2 leading-snug">
        <h2 class="text-xl font-semibold">{{ t('modal_payments.make_withdrawal') }}</h2>
        <h3 class="text-sm font-medium text-subtle">{{ t('modal_payments.make_withdrawal_subtitle') }}</h3>
      </div>

      <div
        class="p-1 flex self-start items-center space-x-1.5 cursor-pointer text-primary hover:text-primary-hover"
        @click="onToggleLimits"
      >
        <Icon
          name="lucide:info"
          size="18"
        />
        <div>limits</div>
      </div>
    </div>

    <template v-if="!showLimits">
      <BaseInputGroup
        :placeholder="t('placeholder.deposit_amount')"
        autocomplete="text"
        inputmode="numeric"
        placeholder-placement="default"
        error-placement="below"
      >
        <template #prefix>
          <div class="self-center mr-2 font-semibold text-lg bg-button-emphasis text-transparent bg-clip-text">R$</div>
        </template>
        <template #suffix>
          <div class="ml-5 flex flex-row justify-center items-center gap-1.5">
            <BaseFlag :country-code="countryCode" />
            <div class="text-sm font-medium text-subtle-light">{{ currency }}</div>
          </div>
        </template>
      </BaseInputGroup>

      <div class="flex space-x-2 font-medium text-sm">
        <div class="text-subtle">{{ t('modal_payments.available_withdraw') }}:</div>
        <div class="text-subtle-light font-semibold">$R 42,069.00</div>
      </div>

      <BaseButtonNew
        :loading="loading"
        variant="emphasis"
        size="xl"
        class="mt-4 mb-2 w-full"
      >
        {{ t("button.withdraw") }}
      </BaseButtonNew>
    </template>
    <template v-else>
      hi
    </template>
  </BaseForm>
</template>

<!-- <script setup lang="ts"> -->
<!-- import { PhQuestion } from "@phosphor-icons/vue"; -->
<!-- import * as zod from "zod"; -->
<!---->
<!-- const { t } = useI18n(); -->
<!---->
<!-- const emit = defineEmits(["click:info", "click:cancel"]); -->
<!---->
<!-- const validationSchema = toTypedSchema( -->
<!--   zod.object({ -->
<!--     value: zod.string().min(1, { message: t("validation.field_required") }), -->
<!--   }), -->
<!-- ); -->
<!-- const { handleSubmit, errors } = useForm({ -->
<!--   validationSchema, -->
<!-- }); -->
<!-- const { value } = useField( -->
<!--   "value", -->
<!--   {}, -->
<!--   { -->
<!--     initialValue: "100.00", -->
<!--   }, -->
<!-- ); -->
<!---->
<!-- const cancel = () => { -->
<!--   emit("click:cancel"); -->
<!-- }; -->
<!---->
<!-- const onSubmit = handleSubmit((values) => { -->
<!--   alert(JSON.stringify(values, null, 2)); -->
<!-- }); -->
<!-- </script> -->
<!---->
<!-- <template> -->
<!--   <form -->
<!--     class="flex flex-col gap-4 w-full" -->
<!--     @submit="onSubmit" -->
<!--   > -->
<!--     <div class="flex items-center justify-between text-subtle"> -->
<!--       <p>Pix Key: <span class="text-emphasis">078.843.426-85</span></p> -->
<!--       <NuxtLink -->
<!--         to="/profile/settings" -->
<!--         type="button" -->
<!--         class="outline-none" -->
<!--       >Edit</NuxtLink> -->
<!--     </div> -->
<!--     <p class="text-subtle"> -->
<!--       My CPF: <span class="text-emphasis">078.843.426-85</span> -->
<!--     </p> -->
<!--     <div -->
<!--       class="p-4 bg-warning flex items-center justify-between rounded-default text-warning" -->
<!--     > -->
<!--       <p>Withdrawal Limits</p> -->
<!--       <button -->
<!--         type="button" -->
<!--         class="outline-none" -->
<!--         title="There are some limits" -->
<!--         @click="emit('click:info')" -->
<!--       > -->
<!--         <PhQuestion :size="24" /> -->
<!--       </button> -->
<!--     </div> -->
<!--     <BaseInputGroup -->
<!--       v-model="value" -->
<!--       class="w-full" -->
<!--       type="number" -->
<!--       wrapper-class="bg-subtle text-lg" -->
<!--       input-class="font-semibold" -->
<!--       :placeholder="t('placeholder.withdrawal_amount')" -->
<!--       :error="errors.value" -->
<!--     > -->
<!--       <template #prefix> -->
<!--         <IconRSGreen /> -->
<!--       </template> -->
<!--     </BaseInputGroup> -->
<!--     <p class="text-subtle"> -->
<!--       {{ t('modal_payments.available_withdrawal') }}: -->
<!--       <span class="text-emphasis">R$ 500,00</span> -->
<!--     </p> -->
<!--     <BaseButton -->
<!--       variant="primary" -->
<!--       big -->
<!--       shadow -->
<!--       class="w-full inline-flex justify-center text-base sm:text-lg" -->
<!--     > -->
<!--       {{ t('button.withdraw') }} -->
<!--     </BaseButton> -->
<!--     <BaseButton -->
<!--       big -->
<!--       shadow -->
<!--       class="w-full bg-muted text-emphasis inline-flex justify-center text-base sm:text-lg" -->
<!--       @click="cancel" -->
<!--     > -->
<!--       {{ t('button.cancel') }} -->
<!--     </BaseButton> -->
<!--   </form> -->
<!-- </template> -->
