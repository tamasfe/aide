<script setup lang="ts">
import { PhQuestion } from "@phosphor-icons/vue";
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import * as zod from "zod";

const { t } = useI18n();

const emit = defineEmits(["click:info", "click:cancel"]);

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
    initialValue: "100.00",
  },
);

const cancel = () => {
  emit("click:cancel");
};

const onSubmit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
});
</script>

<template>
  <form
    class="flex flex-col gap-4 w-full"
    @submit="onSubmit"
  >
    <div class="flex items-center justify-between text-subtle">
      <p>Pix Key: <span class="text-emphasis">078.843.426-85</span></p>
      <NuxtLink
        to="/profile/settings"
        type="button"
        class="outline-none"
      >Edit</NuxtLink>
    </div>
    <p class="text-subtle">
      My CPF: <span class="text-emphasis">078.843.426-85</span>
    </p>
    <div
      class="p-4 bg-warning flex items-center justify-between rounded-default text-warning"
    >
      <p>Withdrawal Limits</p>
      <button
        type="button"
        class="outline-none"
        title="There are some limits"
        @click="emit('click:info')"
      >
        <PhQuestion :size="24" />
      </button>
    </div>
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
    </FormControl>
    <p class="text-subtle">
      Available for withdrawal:
      <span class="text-emphasis">R$ 500,00</span>
    </p>
    <BaseButton
      variant="primary"
      big
      shadow
      class="w-full inline-flex justify-center text-base sm:text-lg"
    >
      Withdraw
    </BaseButton>
    <BaseButton
      big
      shadow
      class="w-full bg-muted text-emphasis inline-flex justify-center text-base sm:text-lg"
      @click="cancel"
    >
      Cancel
    </BaseButton>
  </form>
</template>
