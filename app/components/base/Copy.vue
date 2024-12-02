<script setup lang="ts">
const props = defineProps<{
  value: string | number;
}>();

const copied = ref(false);
const onCopy = () => {
  const value = String(props.value);
  navigator.clipboard.writeText(value);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};
</script>

<template>
  <div
    class="flex flex-row items-center gap-1.5 cursor-pointer"
    @click="onCopy"
  >
    <BaseIcon
      v-show="!copied"
      name="lucide:copy"
      :size="14"
      class="text-subtle"
    />
    <BaseIcon
      v-show="copied"
      name="lucide:circle-check-big"
      :size="14"
      class="text-subtle"
    />
    <slot>
      {{ $t('button.copy') }}
    </slot>
  </div>
</template>
