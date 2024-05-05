<template>
  <div class="flex flex-col justify-center items-center py-8 px-5 md:px-12">
    <img src="~/assets/images/logo/girobet-logo.svg" class="mb-8">
    <div class="w-full last:mb-0">
      <PartialsInputField v-model="form.email.value" class="mb-2" :label="$t('authEmail')" :type="form.email.type"
        :invalid="form.email.invalid" :required="form.email.rules.required.value" :errors="form.email.errors"
        @change="validateFormField(form.email)" />
      <PartialsInputField v-model="form.password.value" class="mb-2" :label="$t('authPassword')"
        :type="form.password.type" :invalid="form.password.invalid" :required="form.password.rules.required.value"
        :errors="form.password.errors" @change="validateFormField(form.password)" />
    </div>

    <div class="inline w-full text-right text-auth-modal-text text-sm mb-4">
      <NuxtLink to="/">
        Forgot password?
      </NuxtLink>
    </div>

    <PartialsButtonComponent :type="'solid'" big class="w-full" :disabled="formInvalid" :color="'secondary'"
      @click="validateLoginFormFields()">
      LOG IN
    </PartialsButtonComponent>

    <div class="inline w-full text-center text-auth-modal-text text-sm mt-4">
      Don't have an account yet?
      <NuxtLink to="/" class="text-auth-modal-highlight">
        Create a free account
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
class InputField implements IInputField {
  public label: string = '';
  public type: string = '';
  public value: string = '';
  public invalid: boolean = false;
  public errors: string[] = [];
  public rules: IInputFieldRulesList = {
    required: {
      value: true,
      message: 'This field is required'
    }
  }

  constructor(input: IInputField) {
    this.label = input.label;
    this.type = input.type;
    this.value = input.value;
    this.invalid = input.invalid;
    this.rules = input.rules;
    this.errors = input.errors;
  }
}

const form = reactive({
  email: new InputField({
    label: "Email",
    type: "email",
    value: "",
    invalid: false,
    errors: [],
    rules: {
      required: {
        value: true,
        message: 'This field is required'
      },
      regex: {
        value: true,
        regex: '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\D{2,3})+$',
        message: 'Invalid email'
      }
    },
  }),
  password: new InputField({
    label: "Password",
    type: "password",
    value: "",
    invalid: false,
    errors: [],
    rules: {
      required: {
        value: true,
        message: 'This field is required'
      },
    }
  }),
});

const store = useTriggersStore();

const formInvalid = computed(() => {
  let invalid = false
  Object.entries(form).forEach(([key, field]) => {
    if (field.invalid) invalid = true
  })
  return invalid
})

const validateFormField = (field: InputField) => {
  field.errors = []
  if (field.rules.required.value && field.value.length === 0) {
    field.errors.push(field.rules.required.message)
  }
  if (field.rules.regex && field.rules.regex.regex && !new RegExp(field.rules.regex.regex).test(field.value)) {
    console.log(field.rules.regex.regex)
    field.errors.push(field.rules.regex.message)
  }

  field.invalid = !!field.errors.length
}

const validateLoginFormFields = () => {
  Object.entries({ email: form.email, password: form.password }).forEach(([key, field]) => {
    validateFormField(field)
  });
}
</script>