<script setup lang="ts">
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
    class="relative p-2 px-6 flex items-center justify-center font-medium"
    :class="backgroundClass"
  >
    <slot />
    <span
      class="absolute top-1/2 right-[10px] transform -translate-y-1/2 cursor-pointer text-xl"
      @click="close"
    >
      X
    </span>
  </div>
</template>
