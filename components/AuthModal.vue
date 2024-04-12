<template>
  <div class="flex justify-center items-center fixed left-0 top-0 size-full z-[999]">
    <div class="absolute left-0 top-0 size-full bg-[#0C0D0D] opacity-90 z-[-1]"></div>
    <div class="w-full max-w-[552px] rounded-xl bg-[#1C1E28] overflow-hidden">
      <img src="/auth-banner.png">
      <div class="flex flex-col justify-center items-center py-4 px-16">
        <img src="/girobet-logo.svg" class="mb-8">

        <div class="w-full last:mb-0">
          <PartialsInputField
            class="mb-4"
            v-for="field in form"
            :label="field.label"
            :type="field.type"
            :invalid="field.invalid"
            :required="field.required"
          />
          
        </div>
        {{ form[3].value }} asdasd
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
let form = reactive([
  {
    label: 'Email',
    type: 'email',
    value: '',
    required: true,
    invalid: false
  },
  {
    label: 'Password',
    type: 'password',
    value: '',
    required: true,
    invalid: false
  },
  {
    label: 'CPF',
    type: 'text',
    value: '',
    required: true,
    invalid: false
  },
  {
    label: 'Phone',
    type: 'phone',
    value: '',
    required: true,
    invalid: false
  },
])


const onChange = (e:any) => {
  console.log(e)
}
</script>