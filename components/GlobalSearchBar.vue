<template>
  <div class="relative w-full">
    <div
      ref="inputWrapper"
      class="w-full max-w-[1232px] transition-[top] duration-500 z-[997]"
      :class="{
        'relative': focus,
        'scroll-mt-[108px]': store.getPromoNotificationOpen,
        'scroll-mt-[58px]': !store.getPromoNotificationOpen,
      }"
    >
      <div class="w-full relative">
        <input
          id="globalSearchInput"
          v-model="model"
          class=" w-full max-w-[1232px] rounded-full bg-search-bg hover:brightness-90 transition-all text-sm font-montserrat text-search-text font-medium p-[10px] outline-none px-[36px] placeholder:text-white placeholder:opacity-80"
          :class="{ 'shadow-2xl': focus }"
          type="text"
          :placeholder="$t('searchPlaceholder')"
          @focus="focus = true"
          @click="onSearchClick()"
        >
        <IconsSearchIcon class="absolute left-[10px] top-[12px]" />
        <div
          class="absolute h-full w-4 p-[2px] right-[12px] top-3 cursor-pointer"
          @click="focus = false; model = ''"
        >
          <img class="w-full" src="~/assets/images/icons/cross.svg">
        </div>
      </div>
      
      <Transition>
        <label
          v-if="focus"
          for="globalSearchInput"
          class="absolute flex flex-col w-full  bg-search-bg mt-[15px] rounded-lg overflow-hidden z-[998]"
          :class="{
            'h-[calc(100vh-240px)]': store.getPromoNotificationOpen,
            'h-[calc(100vh-195px)]': !store.getPromoNotificationOpen,
          }"
        >
          <div class="w-full flex gap-x-4 px-6 border-b-[2px] border-opacity-10 border-b-search-divider">
            <div
              v-for="(category, index) in categories"
              class="px-[5px] py-4 text-white font-montserrat text-xs font-semibold text-opacity-60 hover:brightness-90 cursor-pointer mb-[-2px] border-b-[2px] border-opacity-0 hover:text-opacity-100 hover:border-opacity-100 border-b-search-selected-tab transition duration-300"
              :class="{ 'text-opacity-100 border-b-search-selected-tab border-opacity-100': index === selectedTab }"
              @click="onTabClick(index)"
            >
              {{ category.title }}
            </div>
          </div>
          <div class="flex flex-col flex-1 overflow-y-auto applyCustomScroll">
            <h2 class="p-6 py-5 text-xl text-white font-montserrat font-semibold">
              Suggested Games
            </h2>
            <div class="size-full">
              <NuxtLink
                v-for="item in categories[selectedTab].items"
                to="/"
                class="w-full flex px-6 py-3 hover:bg-search-result-hover transition"
              >
                <div class="w-[80px] h-[110px] bg-black rounded" />
                <div class="flex flex-col flex-1 justify-center pl-4">
                  <p class="text-white font-montserrat font-semibold mb-1">
                    {{ item.title }}
                  </p>
                  <p class="text-white font-montserrat text-opacity-70 m-0">
                    {{ item.subtitle }}
                  </p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </label>
      </Transition>
    </div>
    <Transition>
      <div
        v-if="focus"
        class="fixed left-0 top-0 size-full bg-black bg-opacity-65 z-[996] transition duration-500 cursor-pointer"
        @click="focus = false; store.setStopScrollState(false)"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
const model = defineModel();
const focus = ref(false);
const store = useTriggersStore();

const categories = [
  {
    title: "All",
    items: [
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
    ],
  },
  {
    title: "Slots",
    items: [
      {
        title: "Fortune double 2",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double 2",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double 2",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double 2",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double 2",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double 2",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double 2",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double 2",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
    ],
  },
  {
    title: "Live Casino",
    items: [
      {
        title: "Fortune double 3",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double 3",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double 3",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double 3",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double 3",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double 3",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double 3",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double 3",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
    ],
  },
  {
    title: "Originals",
    items: [
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
      {
        title: "Fortune double",
        subtitle: "Giro Originals",
        imageUrl: "",
      },
    ],
  },
];

const selectedTab: Ref<number> = ref(0);

const inputWrapper: Ref = ref(null);

const onSearchClick = () => {
  store.setStopScrollState(true);
  inputWrapper.value.scrollIntoView({ behavior: "smooth" });
};

const onTabClick = (index: number = 0) => {
  selectedTab.value = index;
};
</script>

<style scroped>
.v-enter-active {
  transition: all 0.35s ease;
}
.v-leave-active {
  transition: all 0.35s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
