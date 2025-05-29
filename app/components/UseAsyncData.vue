<script
setup
lang="ts"
generic="I extends Record<string, any>"
  >
const props = defineProps<{
  id: string;
  fetchItems: () => Promise<I[]>;
  loading?: boolean;
}>();

const { data: items } = await useAsyncData(`loading-wrapper-${props.id}`, async () =>
  props.fetchItems(),
);
</script>

<template>
  <slot :items />
</template>
