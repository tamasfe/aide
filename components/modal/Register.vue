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
    <div class="flex flex-col gap-4 rounded-default">
      <div class="w-full h-52">
        <NuxtImg
          src="/assets/images/wheel.png"
          alt="Wheel"
          class="object-cover w-full h-full"
        />
      </div>
      <div class="inline-flex justify-center py-6">
        <IconsLogo />
      </div>
      <div class="px-8">
        <FormRegisterBrazil />
      </div>
    </div>
  </BaseDialog>
</template>
