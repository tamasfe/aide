<script setup lang="ts">
const { t } = useI18n();

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
    size="5xl"
    class="sm:!rounded-[0.8rem]"
  >
    <div class="flex flex-col sm:flex-row overflow-auto h-full">
      <div
        class="sm:flex-1 relative w-full sm:w-auto pb-[33%] sm:p-0 select-none"
      >
        <NuxtImg
          src="/assets/images/wheel-desktop.png"
          alt="Wheel"
          class="hidden sm:block object-cover w-full h-full sm:rounded-l-[0.8rem]"
        />
        <NuxtImg
          src="/assets/images/wheel-2.png"
          alt="Wheel"
          class="sm:hidden absolute left-0 top-0 object-cover w-full sm:rounded-l-[0.8rem]"
        />
      </div>
      <div class="flex-auto sm:flex-1 flex flex-col gap-2 sm:gap-0 py-2">
        <slot />
      </div>
    </div>
  </BaseDialog>
</template>
