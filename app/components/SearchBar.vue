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

const emit = defineEmits(["focus", "close"]);
</script>

<template>
  <BaseInputGroup
    :placeholder="$t('placeholder.search')"
    :class="cn(
      'relative z-[8]',
      open && 'bg-emphasis',
    )"
    placeholder-placement="default"
    error-placement="below"
    @focus="emit('focus')"
  >
    <template #prefix>
      <div class="mr-4 flex justify-center items-center">
        <BaseSpinner
          v-if="loading"
        />
        <Icon
          v-else
          name="lucide:search"
          size="24"
        />
      </div>
    </template>
    <template #suffix>
      <div class="ml-4 flex justify-center items-center">
        <BaseButton
          variant="ghost"
          size="ghost"
          class="p-1"
          @click="emit('close')"
        >
          <Icon
            name="lucide:x"
            size="24"
          />
        </BaseButton>
      </div>
    </template>
  </BaseInputGroup>
</template>
