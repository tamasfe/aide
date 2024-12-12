<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  onSubmit?: (e?: Event) => void;
}>();

const loading = ref(false);

const onSubmit = async () => {
  if (props.onSubmit) {
    loading.value = true;
    await props.onSubmit();
    loading.value = false;
  }
};
</script>

<template>
  <form
    v-bind="$attrs"
    :class="cn('w-full flex flex-col gap-2', props.class)"
    @submit.prevent="onSubmit"
  >
    <slot :loading="loading" />
  </form>
</template>
