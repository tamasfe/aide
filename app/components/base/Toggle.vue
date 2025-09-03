<script setup lang="ts">
import { Label, SwitchRoot, SwitchThumb } from "reka-ui";

// Don't inherit attributes by default
defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  disabled?: boolean;
  // Class extracts out class from $attrs which allows us the apply the class to the wrapper
  // while still binding $attrs to the SwitchRoot component
  class?: string;
}>();

const switchId = useId();
</script>

<template>
  <div class="flex items-center justify-between" :class="props.class">
    <Label
      class="mr-4"
      :class="props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
      :for="switchId"
    >
      <slot />
    </Label>

    <SwitchRoot
      v-bind="$attrs"
      :id="switchId"
      class="relative inline-flex h-6 w-11 shrink-0 rounded-full p-[2px]
             transition-colors duration-200 ease-in-out focus:outline-none
             focus:ring focus:ring-primary focus:ring-offset-2
             data-[state=checked]:bg-button-emphasis
             data-[state=unchecked]:bg-white/20"
      :class="props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
    >
      <SwitchThumb
        class="pointer-events-none inline-block size-5 transform rounded-full shadow ring-0
               transition duration-200 ease-in-out
               data-[state=checked]:translate-x-5 data-[state=checked]:bg-white
               data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-white/60"
      />
    </SwitchRoot>
  </div>
</template>
