<script setup lang="ts">
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";

const emits = defineEmits<{
  (e: "changed", value: boolean): void;
}>();

defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const enabled = defineModel({
  type: Boolean,
  required: true,
});
</script>

<template>
  <SwitchGroup as="div" class="flex items-center justify-between">
    <SwitchLabel
      :class="{ 'cursor-not-allowed': disabled, 'cursor-pointer': !disabled }"
      class="mr-4"
    >
      <slot />
    </SwitchLabel>
    <Switch
      v-model="enabled"
      :class="[enabled ? 'bg-button-emphasis' : 'bg-white/20', disabled ? 'cursor-not-allowed' : 'cursor-pointer']"
      class="relative inline-flex h-6 w-11 shrink-0 rounded-full p-[2px] transition-colors duration-200 ease-in-out focus:outline-none focus:ring focus:ring-primary focus:ring-offset"
      :disabled="disabled"
      @changed="emits('changed', enabled)"
    >
      <span aria-hidden="true" :class="[enabled ? 'translate-x-5 bg-white' : 'translate-x-0 bg-white/60', 'pointer-events-none inline-block size-5 transform rounded-full  shadow ring-0 transition duration-200 ease-in-out']" />
    </Switch>
  </SwitchGroup>
</template>
