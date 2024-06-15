<script setup lang="ts">
import { BaseModal } from "#components";

const emit = defineEmits(["update:opened"]);

const props = defineProps<{
  opened: boolean;
}>();

const opened = computed({
  get: () => props.opened,
  set: (value) => {
    emit("update:opened", value);
  },
});
</script>

<template>
  <BaseModal
    v-model:opened="opened"
    v-bind="$attrs"
  >
    <template #title>
      <h1 class="font-bold">BaseModal Title</h1>
    </template>
    <div class="flex items-center justify-center">
      Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum
      sint consectetur cupidatat. Lorem ipsum dolor sit amet, officia excepteur
      ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur
      mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia.
      Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate
      voluptate dolor minim nulla est proident. Nostrud officia pariatur ut
      officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit
      commodo officia dolor Lorem duis laboris cupidatat officia voluptate.
      Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis
      officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt
      velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et
      est culpa et culpa duis.
    </div>
  </BaseModal>
</template>
