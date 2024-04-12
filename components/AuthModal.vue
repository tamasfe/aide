<template>
  <Transition>
    <div v-if="store.getAuthModalOpen" class="flex justify-center items-center fixed left-0 top-0 size-full z-[999]">
      <div class="absolute left-0 top-0 size-full bg-[#0C0D0D] opacity-90 z-[-1]" @click="store.setAuthModalState(false)"></div>
      <div class="relative w-full max-w-[552px] rounded-xl bg-[#1C1E28] overflow-hidden">
        <img src="/auth-banner.png">
        <div class="flex items-center justify-center absolute right-6 top-6 size-[32px] rounded bg-[#2B2740] bg-opacity-40 hover:bg-opacity-100 cursor-pointer" @click="store.setAuthModalState(false)">
          <img src="/icons/cross.svg">
        </div>
        <div v-if="store.getAuthModalType === 'register'" class="flex flex-col justify-center items-center py-8 px-16">
          <img src="/girobet-logo.svg" class="mb-8">
          <div class="w-full last:mb-0">
            <PartialsInputField
              class="mb-4"
              v-model="form.email.value"
              :label="form.email.label"
              :type="form.email.type"
              :invalid="form.email.invalid"
              :required="form.email.required"
            />
            <PartialsInputField
              class="mb-4"
              v-model="form.password.value"
              :label="form.password.label"
              :type="form.password.type"
              :invalid="form.password.invalid"
              :required="form.password.required"
            />
            <PartialsInputField
              class="mb-4"
              v-model="form.cpf.value"
              :label="form.cpf.label"
              :type="form.cpf.type"
              :invalid="form.cpf.invalid"
              :required="form.cpf.required"
            />

            <PartialsPhoneInputField
              class="mb-4"
              :label="form.phone.label"
              :invalid="form.phone.invalid"
              :required="form.phone.required"
              @change="e => form.phone.value = e"
            />
          </div>

          <div class="inline w-full text-center text-white text-sm mb-4">
            By signing up 
            <NuxtLink to="/" class="text-[#FFE33A]">
              you agree to our terms and conditions
            </NuxtLink>
          </div>

          <PartialsButtonComponent :label="'CREATE ACCOUNT'" :type="'solid'" big class="w-full"/>
        </div>
        <div v-if="store.getAuthModalType === 'login'" class="flex flex-col justify-center items-center py-8 px-16">
          <img src="/girobet-logo.svg" class="mb-8">
          <div class="w-full last:mb-0">
            <PartialsInputField
              class="mb-4"
              v-model="form.email.value"
              :label="form.email.label"
              :type="form.email.type"
              :invalid="form.email.invalid"
              :required="form.email.required"
            />
            <PartialsInputField
              class="mb-4"
              v-model="form.password.value"
              :label="form.password.label"
              :type="form.password.type"
              :invalid="form.password.invalid"
              :required="form.password.required"
            />
          </div>

          <div class="inline w-full text-right text-white text-sm mb-4">
            <NuxtLink to="/">
              Forgot password?
            </NuxtLink>
          </div>

          <PartialsButtonComponent :label="'LOG IN'" :type="'solid'" big class="w-full"/>
        
          <div class="inline w-full text-center text-white text-sm mt-4">
            Don't have an account yet? 
            <NuxtLink to="/" class="text-[#FFE33A]">
              Create a free account
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
let form = reactive({
  email: {
    label: 'Email',
    type: 'email',
    value: '',
    required: true,
    invalid: false
  },
  password: {
    label: 'Password',
    type: 'password',
    value: '',
    required: true,
    invalid: false
  },
  cpf: {
    label: 'CPF',
    type: 'text',
    value: '',
    required: true,
    invalid: false
  },
  phone: {
    label: 'Phone',
    type: 'phone',
    value: '',
    required: true,
    invalid: false
  },
})

const store = useTriggersStore()
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