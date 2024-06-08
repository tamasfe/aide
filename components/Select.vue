<script setup lang="ts">
import CaretUp from "./Icons/CaretUp.vue";
import CaretDown from "./Icons/CaretDown.vue";
import { autoUpdate, hide, size, useFloating } from "@floating-ui/vue";
import { onClickOutside } from "@vueuse/core";

type SelectOption = {
  value: number | string | boolean;
  title: string;
};

const props = defineProps<{
  modelValue: string | number | boolean;
  inputClass?: string;
  wrapperClass?: string;
  title?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  options: SelectOption[];
}>();

const { options } = toRefs(props);

const emit = defineEmits(["update:modelValue", "change", "focus", "blur"]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const opened = ref(false);
const wrapper = ref<HTMLElement | null>(null);
const floating = ref<HTMLElement | null>(null);

const borderRadiusClass = computed(() => {
  return opened.value ? "rounded-t-default" : "rounded-default";
});

const cursorClass = computed(() => {
  return props.disabled ? "cursor-not-allowed" : "cursor-pointer";
});

const selectTitle = computed(() => {
  const option = options.value.find(
    (option) => option.value === modelValue.value,
  );
  return option?.title || props.placeholder || "Select";
});

const { floatingStyles, update } = useFloating(wrapper, floating, {
  middleware: [
    hide(),
    size({
      apply({ rects, elements }) {
        Object.assign(elements.floating.style, {
          width: `${rects.reference.width}px`,
          zIndex: "9999",
          overflow: "auto",
          maxHeight: "300px",
        });
      },
    }),
  ],
});

const open = () => {
  if (props.disabled) {
    return;
  }
  opened.value = true;
  emit("focus");
};

const close = () => {
  opened.value = false;
  emit("blur");
};

const selectOption = (option: SelectOption) => {
  modelValue.value = option.value;
  emit("change", option.value);
  close();
};

onClickOutside(floating, (event) => {
  if (!opened.value) {
    return;
  }

  if (wrapper.value?.contains(event.target as Node)) {
    event.stopPropagation();
  }

  close();
});

let cleanup: (() => void) | undefined = undefined;

watch(opened, (newValue) => {
  if (newValue) {
    nextTick(() => {
      if (wrapper.value && floating.value) {
        cleanup = autoUpdate(wrapper.value, floating.value, update);
      }
    });
  } else if (cleanup) {
    cleanup();
  }
});
</script>

<template>
  <div ref="wrapper" :class="cursorClass" @click="open">
    <label v-if="title" class="text-subtle">{{ title }}</label>
    <div
      class="flex items-center gap-4 p-[8px] sm:p-[16px] focus:bg-white w-full"
      :class="[wrapperClass, borderRadiusClass]"
    >
      <slot name="prefix" />
      <span
        class="flex-1 text-[18px] text-emphasis font-medium"
        :class="inputClass"
      >
        {{ selectTitle }}
      </span>
      <div>
        <div v-if="opened">
          <CaretUp />
        </div>
        <div v-else>
          <CaretDown />
        </div>
      </div>
    </div>
    <div v-if="error" class="text-red-400">{{ error }}</div>
    <div
      v-if="opened"
      ref="floating"
      :style="floatingStyles"
      class="absolute rounded-b-default bg-emphasis"
    >
      <div class="flex flex-col">
        <div v-for="option in options">
          <div
            class="p-[8px] sm:p-[16px] cursor-pointer text-[18px] text-subtle hover:bg-subtle hover:text-emphasis font-medium"
            @click.stop="selectOption(option)"
          >
            <slot name="option" :option="option">
              {{ option.title }}
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
