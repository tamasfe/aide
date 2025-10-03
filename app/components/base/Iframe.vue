<script setup lang="ts">
import type { HTMLAttributes, PropType } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  class: {
    type: String as PropType<HTMLAttributes["class"]>,
    required: false,
  },
});

/**
 * Optimistic loading spinner for snappier UX
 */
const loading = ref(true);
onBeforeMount(() => {
  const iframe = document.getElementById(props.id) as HTMLIFrameElement;
  if (iframe) {
    const MILLISECONDS_TO_STOP_SPINNER = 3000;
    setTimeout(() => {
      if (loading.value) {
        console.warn("Iframe loading took too long, setting loading to false in case we lost the event");
        loading.value = false;
      }
    }, MILLISECONDS_TO_STOP_SPINNER);
  }
});
</script>

<template>
  <div :class="cn('w-full h-full', props.class)">
    <BaseSpinner
      v-if="loading"
      class="text-subtle absolute inset-0 mx-auto my-auto"
      :size="26"
    />
    <iframe
      :id="id"
      :src="src"
      loading="eager"
      width="100%"
      height="100%"
      frameborder="0"
      marginwidth="0"
      marginheight="0"
      class="block border-0"
      @load="loading = false"
    />
  </div>
</template>
