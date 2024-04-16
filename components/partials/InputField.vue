<template>
  <div class="relative w-full">
    <input
      v-model="model"
      class="peer w-full pb-2 pt-7 px-4 rounded bg-[#2F323C] outline-none text-white font-montserrat autofill:bg-[#2F323C] autofill:text-white"
      :type="type"
      placeholder=" "
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
    default: "",
    required: true,
  },
  label: {
    type: String,
    default: "",
    required: true,
  },
  invalid: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  value: String,
});

const model = defineModel();
</script>

<style scoped>
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 100px #2F323C inset;
  -moz-box-shadow: 0 0 0 100px #2F323C inset;
  box-shadow: 0 0 0 100px #2F323C inset;
  -webkit-text-fill-color: #fff;
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
