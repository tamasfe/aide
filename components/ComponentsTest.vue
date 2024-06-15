<script setup lang="ts">
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
  <div>
    <TestModal
      v-model:opened="modalsOpen.modal1"
      size="lg"
    />
    <TestModal
      v-model:opened="modalsOpen.modal2"
      size="sm"
    />
    <TestModal
      v-model:opened="modalsOpen.modal3"
      size="xl"
    />
    <TestModal
      v-model:opened="modalsOpen.modal4"
      size="xl"
      center
    />
    <div class="p-6 flex flex-col sm:flex-row items-center gap-4 bg-subtle">
      <BaseButton
        variant="primary"
        @click="toggleModal('modal1')"
      >
        Primary
      </BaseButton>
      <BaseButton
        variant="secondary"
        @click="toggleModal('modal2')"
      >
        Secondary
      </BaseButton>
      <BaseButton
        variant="emphasis"
        @click="toggleModal('modal3')"
      >
        Emphasis
      </BaseButton>
      <BaseButton
        variant="primary"
        big
        shadow
        border
        @click="toggleModal('modal4')"
      >
        START
      </BaseButton>
      <BaseButton
        variant="secondary"
        big
      >
        SOMETHING
      </BaseButton>
      <BaseButton
        variant="emphasis"
        big
        shadow
        border
      >
        DEPOSIT
      </BaseButton>
    </div>
  </div>
</template>
