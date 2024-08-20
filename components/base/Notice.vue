<script setup lang="ts">
import { PhX } from "@phosphor-icons/vue";

const props = defineProps<{
  variant: "info";
}>();

const emit = defineEmits(["close"]);

const backgroundClass = computed(() => {
  switch (props.variant) {
    case "info":
      return "bg-info text-info";
    default:
      return "bg-default";
  }
});

const close = () => {
  emit("close");
};
</script>

<template>
  <div
    class="relative flex items-center justify-center font-medium"
    :class="backgroundClass"
  >
    <div class="my-1 sm:my-3.5 ml-2.5 mr-8">
      <slot />
    </div>
    <button
      type="button"
      class="absolute top-1/2 right-[0.625rem] transform -translate-y-1/2 cursor-pointer text-xl outline-none"
      @click="close"
    >
      <PhX :size="24" />
    </button>
  </div>
</template>
