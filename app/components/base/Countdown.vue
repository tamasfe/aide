<script setup lang="ts">
import VueCountdown from "@chenfengyuan/vue-countdown";

defineProps<{
  // In Milliseconds
  time: number;
}>();

defineEmits<{
  // Emit when countdown is finished
  end: () => void;
}>();
</script>

<template>
  <vue-countdown
    v-slot="{ days, hours, minutes, seconds }"
    :time="time"
    @end="() => $emit('end')"
  >
    <slot
      :days="days"
      :hours="hours"
      :minutes="minutes"
      :seconds="seconds"
    />
  </vue-countdown>
</template>
