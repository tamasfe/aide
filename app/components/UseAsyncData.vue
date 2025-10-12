<script
setup
lang="ts"
generic="I extends Record<string, any>"
  >
const props = defineProps<{
  id: string;
  fetchItems: () => Promise<I[]>;
  loading?: boolean;
  waitForServerSideRendering: boolean;
  deferClientSideLoading: boolean;
}>();

const { data: items, status } = useAsyncData(`loading-wrapper-${props.id}`, async () =>
  props.fetchItems(),
{
  server: props.waitForServerSideRendering ?? true,
  lazy: props.deferClientSideLoading ?? true,
},
);
</script>

<template>
  <slot v-if="status === 'success'" :items />
  <slot v-if="status === 'pending' || status === 'idle'" name="loading" />
</template>
