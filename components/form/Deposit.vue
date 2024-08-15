<script setup lang="ts">
import * as zod from "zod";
import { getCurrencySymbol, formatNumber } from "~/utils/index";

const { t } = useI18n();

const minDeposit = 10;

const validationSchema = toTypedSchema(
  zod.object({
    value: zod
      .number()
      .min(10, `${t("payment_flow.min_deposit")} ${minDeposit}`),
  }),
);

const { handleSubmit, errors, meta } = useForm({
  validationSchema,
});

const { value } = useField(
  "value",
  {},
  {
    initialValue: 10,
  },
);

const onSubmit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
});

const quickDepositAmounts = [10, 50, 100];

const currency = ref("BRL");
const locale = ref("pt-BR");
</script>

<template>
  <form
    class="flex flex-col items-center gap-4 w-full"
    @submit="onSubmit"
  >
    <FormControl
      v-model="value"
      class="w-full"
      type="currency"
      wrapper-class="bg-subtle text-lg"
      :currency="currency"
      :locale="locale"
      :placeholder="t('payment_flow.deposit')"
      :error="errors.value"
    />
    <div class="flex items-center gap-2 w-full">
      <button
        v-for="amount of quickDepositAmounts"
        :key="amount"
        type="button"
        class="flex-1 flex items-center bg-subtle outline-none space-x-2 p-3 rounded-default cursor-pointer"
        @click="value = amount"
      >
        <p
          class="bg-button-emphasis text-transparent bg-clip-text text-lg font-bold"
        >
          {{ getCurrencySymbol(currency) }}
        </p>
        <p class="font-semibold">
          {{
            formatNumber(amount, {
              locale: "pt-BR",
              decimalPlaces: 0,
            })
          }}
        </p>
      </button>
    </div>
    <BaseButton
      class="w-full inline-flex justify-center"
      variant="emphasis"
      type="submit"
      big
      :disabled="!meta.valid"
    >
      {{ t("payment_flow.quick_deposit") }}
    </BaseButton>
  </form>
</template>
