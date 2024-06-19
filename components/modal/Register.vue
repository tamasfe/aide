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
      <div class="relative w-full h-40">
        <div
          class="absolute top-1/2 -translate-y-1/2 left-4 text-lg font-bold italic flex flex-col"
        >
          <span class="text-brand-yellow text-sm">EXCLUSIVE</span>
          <span class="font-extrabold text-xl">PRE-RELEASE</span>
          <span class="font-extrabold text-xl">FROM WILDJACK</span>
          <span class="font-extrabold">
            <span class="text-brand-yellow">+100</span> FREE SPINS
          </span>
        </div>
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
