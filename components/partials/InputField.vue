<template>
  <div class="relative w-full">
    <input
      class="peer w-full pb-2 pt-7 px-4 rounded bg-[#2F323C] outline-none text-white font-montserrat autofill:bg-[#2F323C] autofill:text-white"
      :type="type"
      placeholder=" "
      v-model="model"
    >
    <label
      for="input"
      class="peer-focus:text-xs peer-focus:-translate-y-[20px] absolute left-4 top-1/2 -translate-y-[20px] text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base font-montserrat text-white after:content-['*'] after:align-sup after:text-[#FFE33A] transition-all"
    >
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: '',
    required: true
  },
  label: {
    type: String,
    default: '',
    required: true
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false
  },
  value: String
})

let model = defineModel()
</script>

<style scoped>
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 100px #2F323C inset;
  -moz-box-shadow: 0 0 0 100px #2F323C inset;
  box-shadow: 0 0 0 100px #2F323C inset;
  -webkit-text-fill-color: #fff;
}

.select__container::-webkit-scrollbar {
  width: 8px;
}

.select__container::-webkit-scrollbar-track {
  background: #262931;
  border-radius: 2px;
  border: 3px solid #2F323C;
}

.select__container::-webkit-scrollbar-thumb {
  background: #363944;
  border-radius: 4px;
  border: 2px solid #262931;
}

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