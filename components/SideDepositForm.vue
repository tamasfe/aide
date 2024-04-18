<template>
  <div class="w-full">
    <div class="w-full py-6 px-3">
      <PartialsInputField
        v-model="depositModel"
        class="mb-2"
        :label="''"
        type="text"
        :prefix="true"
      >
        <template #prefix>
          $
        </template>
      </PartialsInputField>
      <div class="w-full flex gap-x-2 mb-2">
        <PartialsButtonComponent
          :type="'solid'"
          class="w-full pt-4 pb-4"
          :background="'#40444F'"
          :text-color="'#fff'"
        >
          $10.00
        </PartialsButtonComponent>
        <PartialsButtonComponent
          :type="'solid'"
          class="w-full pt-4 pb-4"
          :background="'#40444F'"
          :text-color="'#fff'"
        >
          $50.00
        </PartialsButtonComponent>
        <PartialsButtonComponent
          :type="'solid'"
          class="w-full pt-4 pb-4"
          :background="'#40444F'"
          :text-color="'#fff'"
        >
          $100.00
        </PartialsButtonComponent>
      </div>
      <PartialsButtonComponent
        :type="'solid'"
        :color="'secondary'"
        big
        class="w-full"
      >
        QUICK DEPOSIT
      </PartialsButtonComponent>
    </div>
  </div>
</template>

<script setup>
const depositModel = ref("");
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
