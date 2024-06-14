<script setup lang="ts">
import { BaseInput } from "#components";
import { useScrollLock } from "@vueuse/core";
import { PopoverAnchor, PopoverContent, PopoverRoot } from "radix-vue";

const props = defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const input = ref<InstanceType<typeof BaseInput> | null>(null);
const content = ref<InstanceType<typeof PopoverContent> | null>(null);
const closeElement = ref<HTMLElement | null>(null);

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

const opened = ref(false);

const overlay = () => {
  if (input.value) {
    const div = document.createElement("div");
    div.classList.add("giro__overlay");
    input.value.$el.style.zIndex = "12";
    input.value.$el.parentElement?.appendChild(div);
  }
};

const hideOverlay = () => {
  if (input.value) {
    input.value.$el.style.zIndex = "";
    const overlay =
      input.value.$el.parentElement?.querySelector(".giro__overlay");
    overlay?.remove();
  }
};

const onOpenAutoFocus = (e: Event) => {
  e.preventDefault();
  window.scrollTo({
    top: input.value?.$el.offsetTop - 150,
    behavior: "smooth",
  });
};

const onClickOutside = (e: CustomEvent) => {
  const element = e.target as HTMLElement;
  if (element !== closeElement.value && input.value?.$el.contains(element)) {
    e.preventDefault();
  }
};

const openPopover = (e: Event) => {
  e.preventDefault();
  input.value?.focus();
  opened.value = true;
};

const close = () => {
  opened.value = false;
};

let scrollLocked: ReturnType<typeof useScrollLock> | null = null;

watch(opened, (value) => {
  if (value) {
    overlay();
  } else {
    hideOverlay();
    input.value?.blur();
  }
  if (scrollLocked) {
    scrollLocked.value = opened.value;
  }
});

onMounted(() => {
  scrollLocked = useScrollLock(document.documentElement);
});
</script>

<template>
  <PopoverRoot v-model:open="opened" class="outline-none">
    <PopoverAnchor as-child>
      <BaseInput
        ref="input"
        v-model="modelValue"
        wrapper-class="bg-emphasis"
        input-class="text-default text-[18px]"
        placeholder="Search"
        type="search"
        @click="openPopover"
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
            ></path>
          </svg>
        </template>
        <template #suffix>
          <div
            v-if="opened"
            ref="closeElement"
            class="font-bold text-xl cursor-pointer"
            aria-label="Close"
            @click="close"
          >
            X
          </div>
        </template>
      </BaseInput>
    </PopoverAnchor>
    <PopoverPortal>
      <PopoverContent
        ref="content"
        class="relative z-[12] rounded-default bg-emphasis/85 backdrop-blur-lg text-default giro__popover-content p-4"
        side="bottom"
        :side-offset="25"
        :collision-boundary="input?.$el"
        @open-auto-focus="onOpenAutoFocus"
        @click-outside="onClickOutside"
        @focus-outside="onClickOutside"
        @pointer-down-outside="onClickOutside"
      >
        <slot />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
