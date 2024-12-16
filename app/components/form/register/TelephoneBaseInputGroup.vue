<script setup lang="ts">
import { useField } from "vee-validate";
import { UserTelephone } from "~/modules/users/domain/UserTelephone";

const props = defineProps({
  initialValue: {
    type: String,
    default: "",
  },
});

/**
 * Dependency injection
 */
const { $dependencies } = useNuxtApp();

type UserTelephonePrimitives = {
  value: string;
  prefix: {
    value: string;
    countryCode: string;
  };
};

const DEFAULT_PREFIX = { value: "+55", countryCode: "BR" };

/**
 * Due to the need of using Zod's "parseAsync" I haven't found a way to concat min and max length validations with the use case
 */
const initialUserTelephoneResult = UserTelephone.newFromSingleValue(props.initialValue);
const { value: telephone, errorMessage, validate } = useField<UserTelephonePrimitives>("telephone", telephone => $dependencies.signupFlows.ui.validateTelephoneOnRegisterFormChanged.handle(telephone.value, telephone.prefix.value, telephone.prefix.countryCode),
  {
    initialValue: initialUserTelephoneResult.isFailure
      ? {
          value: "",
          prefix: DEFAULT_PREFIX,
        }
      : {
          value: initialUserTelephoneResult.value.telephone,
          prefix: initialUserTelephoneResult.value.prefix,
        },
  },
);

watch(telephone.value, async (telephone) => {
  const result = await validate();
  if (result.valid) {
    await $dependencies.signupFlows.ui.upsertSignupFlowOnRegisterFormInputChange.handle({
      telephone: telephone.value,
      telephonePrefix: telephone.prefix.value,
    });
  }
});
</script>

<template>
  <BaseInputGroupTelephone
    v-model:telephone="telephone.value"
    v-model:prefix="telephone.prefix"
    :error-message="errorMessage"
  />
</template>
