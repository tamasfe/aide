<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import type { SearchUserSettingsResponseI } from "~/modules/users/application/SearchUserSettingsSimplified";
import { PAYMENT_PIX_KEY_TYPES } from "~/modules/users/domain/UserSettingsPaymentPix";

const { $dependencies } = useNuxtApp();
const { t } = useI18n();

const props = defineProps<{
  paymentSettings: SearchUserSettingsResponseI["payment"];
  initialData?: {
    email: string;
  };
}>();

const EVP_MAX_CHARS = 36; // According to a definition @daniel found

const validationSchema = toTypedSchema(
  z.object({
    keyType: z.enum(PAYMENT_PIX_KEY_TYPES),

    email: z.string().email(t("validation.email_invalid")).optional(),
    phone: z.string().optional(),
    evp: z.string()
      .max(EVP_MAX_CHARS, t("validation.evp_invalid"))
      .optional(),
  }).refine(data => data.keyType === "EMAIL" ? typeof data.email === "string" && data.email.length > 0 : true, {
    message: t("validation.email_required"),
    path: ["email"],
  })
    .refine(data => data.keyType === "PHONE" ? typeof data.phone === "string" && data.phone.length > 0 : true, {
      message: t("validation.telephone_required"),
      path: ["phone"],
    })
    .refine(data => data.keyType === "EVP" ? typeof data.evp === "string" && data.evp.length > 0 : true, {
      message: t("validation.evp_invalid"),
      path: ["evp"],
    }),
);
const { handleSubmit, errors: formErrors, defineField, meta } = useForm({ validationSchema });
const formErrorMessage = ref("");

const [keyType, keyTypeAttrs] = defineField("keyType");
keyType.value = props.paymentSettings.keyType ?? "CPF";
const paymentKeyTypeOptions = PAYMENT_PIX_KEY_TYPES.map(keyType => ({
  value: keyType,
  title: t(`user_settings.payment.pix_key_type.${keyType}`),
}));
const selectedKeyType = computed(() => paymentKeyTypeOptions.find(option => option.value === keyType.value));

// const [phone, phoneAttrs] = defineField("phone");
// phone.value = props.paymentSettings.keyPhone ?? "";

const [email, emailAttrs] = defineField("email");
email.value = props.paymentSettings.keyEmail ?? props.initialData?.email ?? "";

const [evp, evpAttrs] = defineField("evp");
evp.value = props.paymentSettings.keyEvp ?? "";

const onSubmit = handleSubmit(async (data) => {
  formErrorMessage.value = await $dependencies.users.ui.userSettings.updateSettingsOnForm.handle({
    payment: {
      keyType: data.keyType,
      keyEmail: data.email || null,
      keyEvp: data.evp || null,
      keyPhone: data.phone || null,
    },
  });
});
</script>

<template>
  <BaseForm class="space-y-4" @submit="onSubmit">
    <template #default="{ loading }">
      <div class="leading-snug">
        <h2 class="text-xl font-semibold">{{ $t('modal_user_settings.payment_pix.title') }}</h2>
      </div>

      <BaseSelect
        :model-value="selectedKeyType"
        :options="paymentKeyTypeOptions"
        size="md"
        variant="subtle"
        v-bind="keyTypeAttrs"
        @change="selected => keyType = selected.value"
      />

      <div v-if="selectedKeyType && selectedKeyType.value">
        <div v-if="selectedKeyType.value === 'PHONE'">
          To implement!
        </div>

        <div v-if="selectedKeyType.value === 'EMAIL'">
          <BaseInputGroup
            v-bind="emailAttrs"
            v-model="email"
            :placeholder="$t('field.email')"
            autocomplete="email"
            inputmode="email"
            name="email"
            :error-message="formErrors.email"
          />
        </div>

        <div v-if="selectedKeyType.value === 'EVP'">
          <BaseInputGroup
            v-bind="evpAttrs"
            v-model="evp"
            :placeholder="$t('field.evp')"
            autocomplete="off"
            name="evp"
            :error-message="formErrors.evp"
          />
        </div>

        <div v-if="selectedKeyType.value === 'CPF'">
          <p>{{ $t('modal_user_settings.payment_pix.key_type_cpf_selected_explanation') }}</p>
        </div>
      </div>

      <div class="flex items-center justify-between space-x-4">
        <BaseButton
          size="xl"
          variant="subtle"
          class="w-full space-x-1.5"
          type="button"
          @click="$dependencies.users.ui.emitCommandCloseUserActionModal.handle()"
        >
          {{ $t("button.cancel") }}
        </BaseButton>

        <BaseButton
          :loading="loading"
          size="xl"
          class="w-full space-x-1.5"
          :disabled="!meta.valid"
          type="submit"
        >
          {{ $t("button.save") }}
        </BaseButton>
      </div>
    </template>
  </BaseForm>
</template>
