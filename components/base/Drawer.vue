<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import { PhX } from "@phosphor-icons/vue";
import { cn } from "~/utils";

// DESIGN STATUS:       ✴️
//   * user icon size is stupid
//   * ButtonNew might need to be overridden for md size (md size probably shouldnt change as it looks fine elsewhere just not in the menu)
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const { t } = useI18n();

const drawerVariants = cva(
  "fixed top-0 bottom-0 h-full min-h-0",
  {
    variants: {
      position: {
        left: "left-0",
        right: "right-0",
      },
      size: {
        lg: "max-w-[10rem]",
        full: "w-full",
      },
    },
    defaultVariants: {
      position: "left",
      size: "lg",
    },
  },
);

type DrawerVariants = VariantProps<typeof drawerVariants>;

const positionTransitions = computed(() => ({
  left: {
    enter: "duration-150 ease-out",
    enterFrom: "transform -translate-x-full",
    enterTo: "transform translate-x-0",
    leave: "duration-150 ease-in",
    leaveFrom: "transform translate-x-0",
    leaveTo: "transform -translate-x-full",
  },
  right: {
    enter: "duration-150 ease-out",
    enterFrom: "transform translate-x-full",
    enterTo: "transform translate-x-0",
    leave: "duration-150 ease-in",
    leaveFrom: "transform translate-x-0",
    leaveTo: "transform translate-x-full",
  },
}));

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  open: boolean;
  position?: DrawerVariants["position"];
  size?: DrawerVariants["size"];
  class?: HTMLAttributes["class"];
}>();

const emit = defineEmits(["update:open"]);

const positionTransition = computed(() => {
  return positionTransitions.value[props.position];
});

const onClose = () => {
  open.value = false;
};

const open = computed({
  get: () => props.open,
  set: (value) => {
    emit("update:open", value);
  },
});
</script>

<template>
  <Teleport to="body">
    <TransitionRoot
      appear
      :show="open"
      as="template"
    >
      <Dialog
        v-model:open="open"
        as="div"
        class="relative z-[9]"
        @close="onClose"
      >
        <TransitionChild
          as="template"
          enter="duration-350 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-350 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/40 z-[0]" />
        </TransitionChild>

        <div
          :class="cn(
            drawerVariants({ position, size }),
            props.class,
          )"
        >
          <TransitionChild
            as="template"
            v-bind="positionTransition"
          >
            <DialogPanel
              class="bg-emphasis/85 backdrop-blur-lg rounded-default p-4 flex flex-col gap-4 h-full"
              v-bind="$attrs"
            >
              <button
                type="button"
                class="absolute top-0 right-0 rounded-md text-subtle hover:text-emphasis py-4 px-2 outline-none z-10"
                @click="onClose"
              >
                <span class="sr-only">{{ t('i18n.close') }}</span>
                <div
                  class="p-1 bg-emphasis/50 backdrop-blur-lg rounded-default"
                >
                  <PhX :size="24" />
                </div>
              </button>
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6"
              >
                <div class="relative">
                  <slot name="title" />
                </div>
              </DialogTitle>
              <DialogDescription>
                <slot name="description" />
              </DialogDescription>
              <slot />
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </Teleport>
</template>
