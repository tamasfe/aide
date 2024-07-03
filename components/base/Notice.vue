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
    <div class="my-4 ml-4 mr-10">
      <slot />
    </div>
    <button
      type="button"
      class="absolute top-1/2 right-[10px] transform -translate-y-1/2 cursor-pointer text-xl outline-none"
      @click="close"
    >
      <PhX :size="24" />
    </button>
  </div>
</template>
