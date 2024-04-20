<template>
  <Transition>
    <div
      v-if="store.getAuthModalOpen"
      class="flex justify-center items-center fixed left-0 top-0 size-full z-[999]"
    >
      <div
        class="absolute left-0 top-0 size-full bg-[#0C0D0D] opacity-90 z-[-1]"
        @click="store.setAuthModalState(false)"
      />
      <div class="relative w-full h-full md:h-auto md:max-w-[552px] rounded-xl bg-[#1C1E28] overflow-hidden">
        <img src="/auth-banner.png">
        <div
          class="flex items-center justify-center absolute right-6 top-6 size-[32px] rounded bg-[#2B2740] bg-opacity-40 hover:bg-opacity-100 cursor-pointer"
          @click="store.setAuthModalState(false)"
        >
          <img src="/icons/cross.svg">
        </div>
        <div
          v-if="store.getAuthModalType === 'register'"
          class="flex flex-col justify-center items-center py-8 px-5 md:px-16"
        >
          <img
            src="/girobet-logo.svg"
            class="mb-8"
          >
          <div class="w-full last:mb-0">
            <PartialsInputField
              v-model="form.email.value"
              class="mb-4"
              :label="form.email.label"
              :type="form.email.type"
              :invalid="form.email.invalid"
              :required="form.email.rules.required.value"
              :errors="form.email.errors"
              @change="validateFormField(form.email)"
            />
            <PartialsInputField
              v-model="form.password.value"
              class="mb-4"
              :label="form.password.label"
              :type="form.password.type"
              :invalid="form.password.invalid"
              :required="form.password.rules.required.value"
              :errors="form.password.errors"
              @change="validateFormField(form.password)"
            />
            <PartialsInputField
              v-model="form.cpf.value"
              class="mb-4"
              :label="form.cpf.label"
              :type="form.cpf.type"
              :invalid="form.cpf.invalid"
              :required="form.cpf.rules.required.value"
              :errors="form.cpf.errors"
              @change="validateFormField(form.cpf)"
            />

            <PartialsPhoneInputField
              class="mb-4"
              :label="form.phone.label"
              :invalid="form.phone.invalid"
              :required="form.phone.rules.required.value"
              :errors="form.phone.errors"
              @change="e => {form.phone.value = e; validateFormField(form.phone)}"
            />
          </div>

          <div class="inline w-full text-center text-primary-text text-sm mb-4">
            By signing up
            <NuxtLink
              to="/"
              class="text-[#FFE33A]"
            >
              you agree to our terms and conditions
            </NuxtLink>
          </div>

          <PartialsButtonComponent
            :type="'solid'"
            big
            class="w-full"
            :disabled="formInvalid"
            :color="'secondary'"
            @click="validateRegistrationFormFields()"
          >
            CREATE ACCOUNT
          </PartialsButtonComponent>
        </div>
        <div
          v-if="store.getAuthModalType === 'login'"
          class="flex flex-col justify-center items-center py-8 px-5 md:px-16"
        >
          <img
            src="/girobet-logo.svg"
            class="mb-8"
          >
          <div class="w-full last:mb-0">
            <PartialsInputField
              v-model="form.email.value"
              class="mb-4"
              :label="form.email.label"
              :type="form.email.type"
              :invalid="form.email.invalid"
              :required="form.email.rules.required.value"
              :errors="form.email.errors"
              @change="validateFormField(form.email)"
            />
            <PartialsInputField
              v-model="form.password.value"
              class="mb-4"
              :label="form.password.label"
              :type="form.password.type"
              :invalid="form.password.invalid"
              :required="form.password.rules.required.value"
              :errors="form.password.errors"
              @change="validateFormField(form.password)"
            />
          </div>

          <div class="inline w-full text-right text-white text-sm mb-4">
            <NuxtLink to="/">
              Forgot password?
            </NuxtLink>
          </div>

          <PartialsButtonComponent
            :type="'solid'"
            big
            class="w-full"
            :disabled="formInvalid"
            :color="'secondary'"
            @click="validateLoginFormFields()"
          >
            LOG IN
          </PartialsButtonComponent>

          <div class="inline w-full text-center text-white text-sm mt-4">
            Don't have an account yet?
            <NuxtLink
              to="/"
              class="text-[#FFE33A]"
            >
              Create a free account
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </Transition>
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
      regex: {
        value: true,
        regex: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$",
        message: 'Password must minimum eight characters, at least one upper case English letter, one lower case English letter, one number and one special character'
      }
    }
  }),
  cpf: new InputField({
    label: "CPF",
    type: "text",
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
  phone: new InputField({
    label: "Phone",
    type: "phone",
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
        regex: '^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$',
        message: 'Invalid phone number'
      }
    }
  }),
});

const store = useTriggersStore();

const formInvalid = computed(() => {
  let invalid = false
  Object.entries(form).forEach(([key, field]) => {
    if(field.invalid) invalid = true
  })
  return invalid
})

const validateFormField = (field:InputField) => {{
  field.errors = []
  if(field.rules.required.value && field.value.length === 0) {
      field.errors.push(field.rules.required.message)
    } 
    if(field.rules.regex && field.rules.regex.regex && !new RegExp(field.rules.regex.regex).test(field.value)) {
      console.log(field.rules.regex.regex)
      field.errors.push(field.rules.regex.message)
    }

    field.invalid = !!field.errors.length
}}

const validateRegistrationFormFields = () => {
  Object.entries(form).forEach(([key, field]) => {
    validateFormField(field)
  });
}

const validateLoginFormFields = () => {
  Object.entries({ email: form.email, password: form.password }).forEach(([key, field]) => {
    validateFormField(field)
  });
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.35s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
