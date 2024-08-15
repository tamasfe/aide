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
        <div
          class="absolute top-1/2 sm:top-20 -translate-y-1/2 sm:translate-y-0 left-4 sm:left-1/2 sm:-translate-x-1/2 text-lg sm:text-3xl lg:text-3xl font-black italic sm:leading-[3rem]"
        >
          <p
            class="bg-button-primary text-transparent bg-clip-text font-semibold text-sm sm:text-lg md:text-2xl"
          >
            {{ t("promotions.exclusive").toUpperCase() }}
          </p>
          <p class="text-xl sm:text-3xl md:text-[2.55rem]">
            {{ t("promotions.prerelease").toUpperCase() }}
          </p>
          <p class="text-xl sm:text-3xl md:text-[2.55rem] text-nowrap">
            {{ t("misc.from").toUpperCase() }} WILDJACK
          </p>
          <p>
            <span class="bg-button-primary text-transparent bg-clip-text">+100</span>
            {{ t("promotions.free_spins").toUpperCase() }}
          </p>
        </div>
      </div>
      <div class="flex-auto sm:flex-1 flex flex-col gap-2 sm:gap-0 py-2">
        <slot />
      </div>
    </div>
  </BaseDialog>
</template>
