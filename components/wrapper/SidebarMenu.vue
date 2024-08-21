<script setup lang="ts">
import { PhGridFour, PhHouse, PhStar } from "@phosphor-icons/vue";
import { useGameCategories } from "~/composables/useGameCategories";

const open = ref(false);



const { isMobile } = useDevice();
const { isAuthenticated } = useAuth();

const { t } = useI18n();

const { data: categories } = await useGameCategories("home");
// TODO: maybe get all and filter them here to avoid multiple requests
const { data: allCategories } = await useGameCategories();

const homeGameCategories = computed(() => {
  const data = categories.value || [];
  return data.map(category => ({
    title: t(getGameCategoryTranslationKey(category.identifier)),
    value: `/categories/${category.id}`,
    // TODO: hardcoded for now we'll change icons anyways
    icon: PhStar,
    iconClass: "text-brand-yellow",
  }));
});

const allGameCategories = computed(() => {
  const data = allCategories.value || [];
  return data.map(category => ({
    title: t(getGameCategoryTranslationKey(category.identifier)),
    value: `/categories/${category.id}`,
    icon: PhStar,
    iconClass: "text-brand-yellow",
  }));
});

const emit = defineEmits(["update:opened"]);
const props = defineProps<{
  opened: boolean;
}>();

const size = isMobile ? "full" : "xl";
const bottomPadding = ref(0);
const opened = computed({
  get: () => props.opened,
  set: value => emit("update:opened", value),
});

onMounted(() => {
  const menu = document.querySelector(".giro__mobile-menu");
  if (menu) {
    bottomPadding.value = menu.clientHeight;
  }
});

watch(
  () => props.opened,
  (value) => {
    if (value) {
      const menu = document.querySelector(".giro__mobile-menu");
      if (menu) {
        bottomPadding.value = menu.clientHeight;
      }
    }
  },
);
</script>

<template>
  <BaseDrawer
    v-model:opened="open"
    position="left"
    :size="size"
    class="px-0.5"
  >
    <template #title>
      <div class="flex items-center justify-between pl-4 max-w-48">
        <IconsLogo />
      </div>
    </template>
    <div
      class="min-w-[24rem] flex flex-col gap-4 overflow-y-auto py-1 px-2"
      :style="{ paddingBottom: `${bottomPadding}px` }"
    >
      <FormDeposit v-if="isAuthenticated" />
      <div class="select-none">
        <BaseMenuCollapse
          :parent="{
            title: 'Home',
            value: '/',
            icon: PhHouse,
            iconClass: 'text-subtle',
          }"
          :options="homeGameCategories"
        />
        <BaseMenuCollapse
          :parent="{
            title: 'All Games',
            value: 'all_games',
            icon: PhGridFour,
            iconClass: 'text-subtle',
          }"
          :options="allGameCategories"
        />
        <BaseMenuLink
          class="p-4 text-emphasis"
          title="Promotions"
          value="promotions"
          :icon="PhStar"
          icon-class="text-subtle"
        />
        <BaseMenuLink
          class="p-4 text-emphasis"
          title="VIP"
          value="vip"
          :icon="PhStar"
          icon-class="text-subtle"
        />
        <BaseMenuLink
          class="p-4 text-emphasis"
          title="Recently added"
          value="recently_added"
          :icon="PhStar"
          icon-class="text-subtle"
        />
      </div>
    </div>
  </BaseDrawer>
</template>
