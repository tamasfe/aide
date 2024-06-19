<script setup lang="ts">
const emit = defineEmits(["update:opened"]);

const props = defineProps<{
  opened: boolean;
}>();

const opened = computed({
  get: () => props.opened,
  set: (value: boolean) => emit("update:opened", value),
});
</script>

<template>
  <BaseDialog
    v-bind="$attrs"
    v-model:opened="opened"
    size="3xl"
  >
    <div class="flex flex-col gap-4 overflow-auto h-full">
      <div class="w-full h-32">
        <NuxtImg
          src="/assets/images/wheel.png"
          alt="Wheel"
          class="object-cover w-full h-full"
        />
      </div>
      <div class="inline-flex justify-center py-2">
        <IconsLogo />
      </div>
      <div class="px-6">
        <FormRegisterBrazil />
      </div>
    </div>
  </BaseDialog>
</template>
