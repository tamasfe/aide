<template>
  <div class="w-full">
    <div class="w-full py-6 px-3">
      <PartialsInputField v-model="depositModel" class="mb-2" :label="''" type="text" :prefix="true">
        <template v-slot:prefix>
          $
        </template>
      </PartialsInputField>
      <div class="w-full flex gap-x-2 mb-2">
        <PartialsButtonComponent :label="'$10.00'" :type="'solid'" class="w-full pt-4 pb-4" :background="'#40444F'"
          :color="'#fff'" />
        <PartialsButtonComponent :label="'$50.00'" :type="'solid'" class="w-full pt-4 pb-4" :background="'#40444F'"
          :color="'#fff'" />
        <PartialsButtonComponent :label="'$100.00'" :type="'solid'" class="w-full pt-4 pb-4" :background="'#40444F'"
          :color="'#fff'" />
      </div>
      <PartialsButtonComponent :label="'QUICK DEPOSIT'" :type="'solid'" big class="w-full" />
    </div>
  </div>
</template>

<script setup>
const depositModel = ref('');
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.35s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>