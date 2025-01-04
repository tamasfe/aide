<script setup lang="ts">
// DESIGN STATUS ✴️
//   - The text is too large on mobile which goes back to refactoring InputGroup in a PROPER way to add size. we might not use "variants" because those can only output ONE string of classes (i think) and what we want is an initial variant that also creates other classes for input class, etc. or we can do inputClass, iconClass, etc, but in general that is ugly

withDefaults(defineProps<{
  loading?: boolean;
  open?: boolean;
}>(), {
  loading: false,
  open: false,
});

// this needs to hide/show close button
const query = defineModel({
  type: String,
  required: true,
});

const emit = defineEmits<{
  (e: "focus" | "close"): void;
}>();

const onClickCloseButton = () => {
  emit("close");
  query.value = "";
};
</script>

<template>
  <BaseInputGroup
    v-model="query"
    :placeholder="$t('placeholder.search')"
    class="relative z-[8]"
    inputmode="search"
    autocomplete="off"
    placeholder-placement="default"
    error-placement="below"
    @focus="emit('focus')"
  >
    <template #prefix>
      <div class="mr-4 flex justify-center items-center">
        <BaseSpinner
          v-if="loading"
          class="text-subtle"
          :size="22"
        />
        <BaseIcon
          v-else
          name="lucide:search"
          :size="22"
        />
      </div>
    </template>
    <template #suffix>
      <div
        v-if="query.length"
        class="ml-4 flex justify-center items-center"
      >
        <BaseButton
          variant="ghost"
          size="ghost"
          class="p-1"
          @click="onClickCloseButton"
        >
          <BaseIcon
            name="lucide:x"
            :size="20"
          />
        </BaseButton>
      </div>
    </template>
  </BaseInputGroup>
</template>
