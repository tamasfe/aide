<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const props = withDefaults(
  defineProps<{
    open: boolean;
    banner?: "none" | "top" | "left";
    logo?: boolean;
  }>(),
  {
    banner: "none",
    logo: true,
  },
);

const emit = defineEmits(["update:open", "close"]);

const open = computed({
  get: () => props.open,
  set: (value: boolean) => emit("update:open", value),
});
</script>

<template>
  <BaseDialog
    v-bind="$attrs"
    v-model:open="open"
    @close="emit('close')"
  >
    <div class="flex flex-row">
      <div
        v-if="banner === 'left'"
        class="hidden sm:block"
      >
        banner left
      </div>
      <div class="w-full flex flex-col items-center">
        <div
          v-if="banner === 'left' || banner === 'top'"
          :class="{ 'sm:hidden': banner === 'left' }"
        >
          banner top
        </div>

        <div
          v-if="logo"
          class="w-[9rem] my-6 self-center"
        >
          <IconLogo />
        </div>

        <slot />
      </div>
    </div>
    <!-- <div -->
    <!--   v-if="banner === 'left'" -->
    <!--   class="flex flex-col overflow-auto h-full" -->
    <!-- > -->
    <!--   <div -->
    <!--     class="relative w-full pb-[33%] select-none" -->
    <!--   > -->
    <!--     <NuxtImg -->
    <!--       src="/assets/images/wheel-2.png" -->
    <!--       alt="Wheel" -->
    <!--       class="absolute left-0 top-0 object-cover w-full sm:rounded-t-[0.7rem]" -->
    <!--     /> -->
    <!--   </div> -->
    <!---->
    <!--   <div -->
    <!--     v-if="logo" -->
    <!--     class="flex justify-center py-6 sm:pt-12 sm:pb-4" -->
    <!--   > -->
    <!--     <div class="min-w-36 sm:min-w-40"> -->
    <!--       <IconLogo /> -->
    <!--     </div> -->
    <!--   </div> -->
    <!---->
    <!--   <slot /> -->
    <!-- </div> -->
    <!-- <div -->
    <!--   v-else-if="banner === 'top'" -->
    <!--   class="flex flex-col sm:flex-row overflow-auto h-full" -->
    <!-- > -->
    <!--   <div -->
    <!--     class="sm:flex-1 relative w-full sm:w-auto pb-[33%] sm:p-0 select-none" -->
    <!--   > -->
    <!--     <NuxtImg -->
    <!--       src="/assets/images/wheel-desktop.png" -->
    <!--       alt="Wheel" -->
    <!--       class="hidden sm:block object-cover w-full h-full sm:rounded-l-[0.7rem]" -->
    <!--     /> -->
    <!--     <NuxtImg -->
    <!--       src="/assets/images/wheel-2.png" -->
    <!--       alt="Wheel" -->
    <!--       class="sm:hidden absolute left-0 top-0 object-cover w-full sm:rounded-l-[0.7rem]" -->
    <!--     /> -->
    <!--   </div> -->
    <!--   <div class="flex-auto sm:flex-1 flex flex-col gap-2 sm:gap-0 py-2"> -->
    <!--     <slot /> -->
    <!--   </div> -->
    <!-- </div> -->
  </BaseDialog>
</template>
