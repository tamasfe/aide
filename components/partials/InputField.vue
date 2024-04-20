<template>
  <div class="w-full flex flex-col">
    <div class="relative w-full flex mb-1">
      <input
        v-model="model"
        class="peer w-full px-4 rounded bg-[#2F323C] outline-none text-white font-montserrat transition-all border hover:border-[#FFE33A]"
        :class="{ 'pb-2 pt-7 px-4': label, 'pb-4 pt-4 px-4': !label, 'pl-8': prefix, 'border-red-600': invalid,  'border-[#2F323C]': !invalid }"
        :type="type"
        placeholder=" "
        @input="emit('change')"
      >
      <div class="absolute left-0 top-0 h-full flex items-center">
        <span
          v-if="prefix"
          class="text-white font-semibold px-3 align-middle pb-[2px]"
        >
          <slot name="prefix" />
        </span>
      </div>

      <label
        v-if="label"
        for="input"
        class="peer-focus:text-xs peer-focus:-translate-y-[20px] text-white absolute left-4 top-1/2 -translate-y-[20px] text-xs peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base font-montserrat transition-all"
        :class="{ 'after:content-[`*`] after:align-sup after:text-[#FFE33A]': required }"
      >
        {{ label }}
      </label>
    </div>

    <div class="w-full inline-flex flex-col">
      <p v-for="error in errors" class="font-montserrat text-red-600 text-xs">
        {{ error }}
      </p>
    </div>
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
    type: [Boolean, String],
    default: false,
  },
  value: String,
  prefix: {
    type: Boolean,
    default: false,
  },
  errors: {
    type: Array,
    default: []
  }
});

const model = defineModel();
const emit = defineEmits(['change'])
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
