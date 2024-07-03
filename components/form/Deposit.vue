<script setup lang="ts">
import * as zod from "zod";

const { t } = useI18n();

const validationSchema = toTypedSchema(
  zod.object({
    value: zod.string().min(1, { message: t("field_required") }),
  }),
);
const { handleSubmit, errors } = useForm({
  validationSchema,
});
const { value } = useField(
  "value",
  {},
  {
    initialValue: "10.00",
  },
);

const onSubmit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
});

const quickDepositAmounts = ["10.00", "50.00", "100.00"];
</script>

<template>
  <form
    class="flex flex-col items-center gap-4 w-full"
    @submit="onSubmit"
  >
    <FormControl
      v-model="value"
      class="w-full"
      type="number"
      wrapper-class="bg-subtle text-lg"
      input-class="font-semibold"
      :placeholder="t('deposit')"
      :error="errors.value"
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
    <div class="flex items-center gap-2 w-full">
      <button
        v-for="amount of quickDepositAmounts"
        :key="amount"
        type="button"
        class="flex-1 flex items-center bg-subtle outline-none space-x-2 p-3 rounded-default cursor-pointer"
        @click="value = amount"
      >
        <IconsRSGreen />
        <p class="font-semibold">{{ amount }}</p>
      </button>
    </div>
    <BaseButton
      class="w-full inline-flex justify-center"
      variant="emphasis"
      type="submit"
      big
    >
      {{ t("quick_deposit") }}
    </BaseButton>
  </form>
</template>
