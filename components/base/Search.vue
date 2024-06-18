<script setup lang="ts">
import { useScrollLock } from "@vueuse/core";

import { Popover, PopoverPanel } from "@headlessui/vue";

import { BaseInput } from "#components";

const props = defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const input = ref<InstanceType<typeof BaseInput> | null>(null);
const popover = ref<InstanceType<typeof Popover> | null>(null);

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const opened = ref(false);

const openPopover = () => {
  if (opened.value) return;
  opened.value = true;
};

const close = (event?: Event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  opened.value = false;
};

let scrollLocked: ReturnType<typeof useScrollLock> | null = null;

const escape = (e: KeyboardEvent) => {
  if (e.key === "Escape" && opened.value) {
    e.preventDefault();
    e.stopPropagation();
    close();
  }
};

watch(opened, (value) => {
  if (value) {
    window.addEventListener("keydown", escape);
    window.scrollTo({
      top: popover.value?.$el.offsetTop - 150,
      behavior: "smooth",
    });
    input.value?.focus();
  }
  else {
    window.removeEventListener("keydown", escape);
    input.value?.blur();
  }

  if (scrollLocked) {
    scrollLocked.value = opened.value;
  }
});

onMounted(() => {
  scrollLocked = useScrollLock(document.documentElement);
});

defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <Popover
    ref="popover"
    class="relative outline-none"
    :class="$attrs.class"
  >
    <BaseInput
      ref="input"
      v-model="modelValue"
      :class="[opened ? 'z-[13]' : '']"
      wrapper-class="bg-emphasis"
      input-class="text-default text-[18px]"
      placeholder="Search"
      type="text"
      v-bind="$attrs"
      @focus="openPopover"
    >
      <template #prefix>
        <!-- magnifying glass icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path
            d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
          />
        </svg>
      </template>
      <template #suffix>
        <div
          v-if="opened"
          class="font-bold text-xl cursor-pointer"
          aria-label="Close"
          @click="close"
        >
          X
        </div>
      </template>
    </BaseInput>
    <div
      v-if="opened"
      class="fixed inset-0 z-[12] bg-black/40"
      aria-hidden="true"
      @click="close"
    />
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel
        v-if="opened"
        class="absolute left-1/2 z-[13] mt-10 -translate-x-1/2 w-full outline-none"
        static
      >
        <div
          class="rounded-default bg-emphasis/85 backdrop-blur text-default p-4 outline-none"
          role="dialog"
          aria-modal="true"
        >
          <slot />
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>
