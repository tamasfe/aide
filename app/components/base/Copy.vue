<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
  showLabel: {
    type: Boolean,
    default: false,
    required: false,
  },
  showIcon: {
    type: Boolean,
    default: true,
    required: false,
  },
  size: {
    type: Number,
    default: 14,
    required: false,
  },
  class: {
    type: String as PropType<HTMLAttributes["class"]>,
    required: false,
  },
});

const copied = defineModel("copied", {
  type: Boolean,
  required: false,
});

const onCopy = () => {
  copyToClipboard(String(props.value));

  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
};
</script>

<template>
  <div
    :class="cn(
      'flex flex-row items-center gap-1.5 cursor-pointer',
      props.class,
    )"
    @click="onCopy"
  >
    <slot :copied :on-copy="onCopy" />
    <slot name="prefix" :copied :on-copy="onCopy" />
    <slot
      v-if="showIcon"
      name="icon"
      :copied
      :on-copy="onCopy"
    >
      <BaseIcon
        v-show="!copied"
        name="lucide:copy"
        :size="size"
        class="text-inherit"
      />
      <BaseIcon
        v-show="copied"
        name="lucide:circle-check-big"
        :size="size"
        class="text-inherit"
      />
    </slot>
    <slot name="suffix" :copied :on-copy="onCopy">
      <span :class="{ 'sr-only': !showLabel }">
        {{ $t('button.copy') }}
      </span>
    </slot>
  </div>
</template>
