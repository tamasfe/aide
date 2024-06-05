<script setup lang="ts">
import { Button } from "#components";

const modalsOpen = reactive<any>({
  modal1: false,
  modal2: false,
  modal3: false,
  modal4: false,
});

const toggleModal = (key: any) => {
  modalsOpen[key] = !modalsOpen[key];
};
</script>

<template>
  <div class="h-screen bg-default text-default">
    <TestModal v-model:opened="modalsOpen.modal1" size="lg" slide-out-left />
    <TestModal v-model:opened="modalsOpen.modal2" size="sm" slide-out-right />
    <TestModal v-model:opened="modalsOpen.modal3" size="xl" />
    <TestModal v-model:opened="modalsOpen.modal4" size="xl" center />
    <div class="p-6 flex flex-col sm:flex-row items-center gap-4 bg-subtle">
      <Button variant="primary" @click="toggleModal('modal1')">Primary</Button>
      <Button variant="secondary" @click="toggleModal('modal2')"
        >Secondary</Button
      >
      <Button variant="emphasis" @click="toggleModal('modal3')"
        >Emphasis</Button
      >
    </div>
    <div class="p-6 flex flex-col sm:flex-row items-center gap-4 bg-subtle">
      <Button variant="primary" big shadow border @click="toggleModal('modal4')"
        >START</Button
      >
      <Button variant="secondary" big>SOMETHING </Button>
      <Button variant="emphasis" big shadow border>DEPOSIT</Button>
    </div>
    <slot />
  </div>
</template>
