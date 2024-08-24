<script setup lang="ts">
const emit = defineEmits(["update:open"]);

const props = withDefaults(
  defineProps<{
    open: boolean;
    banner?: "top" | "left" | "none";
    logo?: boolean;
  }>(),
  {
    banner: "none",
    logo: true,
  },
);

const open = computed({
  get: () => props.open,
  set: (value: boolean) => emit("update:open", value),
});
const image = ref(true);

const reset = () => {
  image.value = true;
};

const showImage = (value: boolean) => {
  image.value = value;
};

const size = computed(() => {
  return props.banner === "left" ? "2xl" : "4xl";
});

defineExpose({
  reset,
  showImage,
});
</script>

<template>
  <BaseDialog
    v-bind="$attrs"
    v-model:open="open"
    :close="image"
    :size="size"
    class="sm:!rounded-[0.7rem]"
    @close="reset"
  >
    <div
      v-if="banner === 'left'"
      class="flex flex-col overflow-auto h-full"
    >
      <div
        v-if="image"
        class="relative w-full pb-[33%] select-none"
      >
        <NuxtImg
          src="/assets/images/wheel-2.png"
          alt="Wheel"
          class="absolute left-0 top-0 object-cover w-full sm:rounded-t-[0.7rem]"
        />
      </div>

      <div
        v-if="logo"
        class="flex justify-center py-6 sm:pt-12 sm:pb-4"
      >
        <div class="min-w-36 sm:min-w-40">
          <IconLogo />
        </div>
      </div>

      <slot />
    </div>
    <div
      v-else
      class="flex flex-col sm:flex-row overflow-auto h-full"
    >
      <div
        class="sm:flex-1 relative w-full sm:w-auto pb-[33%] sm:p-0 select-none"
      >
        <NuxtImg
          src="/assets/images/wheel-desktop.png"
          alt="Wheel"
          class="hidden sm:block object-cover w-full h-full sm:rounded-l-[0.7rem]"
        />
        <NuxtImg
          src="/assets/images/wheel-2.png"
          alt="Wheel"
          class="sm:hidden absolute left-0 top-0 object-cover w-full sm:rounded-l-[0.7rem]"
        />
      </div>
      <div class="flex-auto sm:flex-1 flex flex-col gap-2 sm:gap-0 py-2">
        <slot />
      </div>
    </div>
  </BaseDialog>
</template>
