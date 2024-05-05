<template>
  <Transition name="fade">
    <div
      v-if="store.showSideMenu"
      class="fixed size-full left-0 top-0 bg-black bg-opacity-35 transition-all duration-300 z-[998]"
      @click="store.setSideMenuState(false)"
    />
  </Transition>
  <Transition>
    <div
      v-if="store.showSideMenu"
      class="applyCustomScroll flex flex-col fixed left-0 top-0 h-full w-full max-w-full md:max-w-[345px] bg-side-menu-bg transition-all duration-300 z-[998] overflow-hidden"
    >
      <div class="flex items-center w-full py-[18px] px-3 border-b border-opacity-15 border-b-white">
        <div class="flex-1">
          <img src="~/assets/images/logo/girobet-logo.svg">
        </div>
        <div
          class="p-[9px] md:hidden bg-side-menu-close-button rounded cursor-pointer"
          @click="store.setSideMenuState(false)"
        >
          <img
            src="~/assets/images/icons/cross.svg"
            class="w-[14px]"
          >
        </div>
      </div>
      <SideDepositForm v-if="store.getSideMenuType === 'menu' && authStore.getAuthorizationState" />
      <Transition name="fade-left">
        <div v-if="store.getSideMenuType === 'menu'">
          <PartialsAccordion :label="'menu item'" class="border-b border-b-white border-opacity-15">
            <NuxtLink
              to="/"
              class="inline-flex px-3 py-[10px] text-white hover:bg-side-menu-item-hover transition"
            >
              <img
                src="~/assets/images/icons/side-menu/settings.svg"
                class="mr-3"
              >
              Menu sub-item
            </NuxtLink>
            <NuxtLink
              to="/"
              class="inline-flex px-3 py-[10px] text-white hover:bg-side-menu-item-hover transition"
            >
              <img
                src="~/assets/images/icons/side-menu/settings.svg"
                class="mr-3"
              >
              Menu sub-item
            </NuxtLink>
            <NuxtLink
              to="/"
              class="inline-flex px-3 py-[10px] text-white hover:bg-side-menu-item-hover transition"
            >
              <img
                src="~/assets/images/icons/side-menu/settings.svg"
                class="mr-3"
              >
              Menu sub-item
            </NuxtLink>
            <NuxtLink
              to="/"
              class="inline-flex px-3 py-[10px] text-white hover:bg-side-menu-item-hover transition"
            >
              <img
                src="~/assets/images/icons/side-menu/settings.svg"
                class="mr-3"
              >
              Menu sub-item
            </NuxtLink>
            <NuxtLink
              to="/"
              class="inline-flex px-3 py-[10px] text-white hover:bg-side-menu-item-hover transition"
            >
              <img
                src="~/assets/images/icons/side-menu/settings.svg"
                class="mr-3"
              >
              Menu sub-item
            </NuxtLink>
          </PartialsAccordion>
          <PartialsAccordion :label="'menu item'" class="border-b border-b-white border-opacity-15">
            <NuxtLink
              to="/"
              class="inline-flex px-3 py-[10px] text-white hover:bg-side-menu-item-hover transition"
            >
              <img
                src="~/assets/images/icons/side-menu/settings.svg"
                class="mr-3"
              >
              Menu sub-item
            </NuxtLink>
            <NuxtLink
              to="/"
              class="inline-flex px-3 py-[10px] text-white hover:bg-side-menu-item-hover transition"
            >
              <img
                src="~/assets/images/icons/side-menu/settings.svg"
                class="mr-3"
              >
              Menu sub-item
            </NuxtLink>
            <NuxtLink
              to="/"
              class="inline-flex px-3 py-[10px] text-white hover:bg-side-menu-item-hover transition"
            >
              <img
                src="~/assets/images/icons/side-menu/settings.svg"
                class="mr-3"
              >
              Menu sub-item
            </NuxtLink>
            <NuxtLink
              to="/"
              class="inline-flex px-3 py-[10px] text-white hover:bg-side-menu-item-hover transition"
            >
              <img
                src="~/assets/images/icons/side-menu/settings.svg"
                class="mr-3"
              >
              Menu sub-item
            </NuxtLink>
            <NuxtLink
              to="/"
              class="inline-flex px-3 py-[10px] text-white hover:bg-side-menu-item-hover transition"
            >
              <img
                src="~/assets/images/icons/side-menu/settings.svg"
                class="mr-3"
              >
              Menu sub-item
            </NuxtLink>
          </PartialsAccordion>
          <PartialsAccordion :label="'menu item'" class="border-b border-b-white border-opacity-15">
            <NuxtLink
              to="/"
              class="inline-flex px-3 py-[10px] text-white hover:bg-side-menu-item-hover transition"
            >
              <img
                src="~/assets/images/icons/side-menu/settings.svg"
                class="mr-3"
              >
              Menu sub-item
            </NuxtLink>
            <NuxtLink
              to="/"
              class="inline-flex px-3 py-[10px] text-white hover:bg-side-menu-item-hover transition"
            >
              <img
                src="~/assets/images/icons/side-menu/settings.svg"
                class="mr-3"
              >
              Menu sub-item
            </NuxtLink>
            <NuxtLink
              to="/"
              class="inline-flex px-3 py-[10px] text-white hover:bg-side-menu-item-hover transition"
            >
              <img
                src="~/assets/images/icons/side-menu/settings.svg"
                class="mr-3"
              >
              Menu sub-item
            </NuxtLink>
            <NuxtLink
              to="/"
              class="inline-flex px-3 py-[10px] text-white hover:bg-side-menu-item-hover transition"
            >
              <img
                src="~/assets/images/icons/side-menu/settings.svg"
                class="mr-3"
              >
              Menu sub-item
            </NuxtLink>
            <NuxtLink
              to="/"
              class="inline-flex px-3 py-[10px] text-white hover:bg-side-menu-item-hover transition"
            >
              <img
                src="~/assets/images/icons/side-menu/settings.svg"
                class="mr-3"
              >
              Menu sub-item
            </NuxtLink>
          </PartialsAccordion>
        </div>

        <div
          v-else-if="store.getSideMenuType === 'search'"
          class="w-full flex flex-col"
        >
          <div class="relative w-full pt-5 px-3 pb-1">
            <input
              v-model="searchModel"
              class=" w-full rounded-full bg-side-menu-search hover:brightness-90 transition-all text-sm font-montserrat text-white font-semibold p-[10px] outline-none pl-[36px] placeholder:text-white placeholder:opacity-80"
              type="text"
              :placeholder="$t('searchPlaceholder')"
            >
            <IconsSearchIcon class="absolute left-[10px] top-3 mt-5 mx-3 mb-1" />
            <div
              class="absolute h-full w-4 p-[2px] right-[10px] top-3 mt-5 mx-3 cursor-pointer"
              @click="searchModel = ''"
            >
              <img class="w-full" src="~/assets/images/icons/cross.svg">
            </div>
          </div>
          <div class="w-full pb-[60px]">
            <div
              class="flex flex-col w-full h-full mt-[15px] rounded-lg overflow-hidden z-[998]"
            >
              <div class="w-full flex gap-x-4 px-6 border-b-[2px] border-opacity-10 border-b-side-menu-search-tab">
                <div
                  v-for="(category, index) in categories"
                  class="px-[5px] py-4 text-white font-montserrat text-xs font-semibold text-opacity-60 hover:brightness-90 cursor-pointer mb-[-2px] border-b-[2px] border-opacity-0 hover:text-opacity-100 hover:border-opacity-100 border-b-side-menu-search-selected-tab transition duration-300"
                  :class="{ 'text-opacity-100 border-b-side-menu-search-selected-tab border-opacity-100': index === selectedTab }"
                  @click="onTabClick(index)"
                >
                  {{ category.title }}
                </div>
              </div>
              <div class="flex-1 overflow-y-auto applyCustomScroll overflow-auto">
                <h2 class="p-3 py-5 text-xl text-white font-montserrat font-semibold">
                  {{ $t('suggestedGames') }}
                </h2>
                <div class="size-full">
                  <NuxtLink
                    v-for="item in categories[selectedTab].items"
                    to="/"
                    class="w-full flex px-3 py-3 hover:bg-side-menu-search-result-hover transition"
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
            </div>
          </div>
        </div>
      </Transition>

      <div class="flex-1" />
      <Transition name="fade-left">
        <div
          v-if="store.getSideMenuType === 'menu'"
          class="w-full px-3 pt-10 pb-[75px] md:pb-10"
        >
          <PartialsDropdownSelect
            v-model="langModel"
            :items="lang"
            :open-top="true"
            class="w-full"
          />
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const store = useTriggersStore();
const authStore = useAuthStore();

const searchModel = ref("");

const langModel = ref({
  label: "English",
  flag: "us",
  value: "en",
});

const lang = [
  {
    label: "English",
    flag: "us",
    value: "en",
  },
  {
    label: "Brazil",
    flag: "br",
    value: "br",
  },
  {
    label: "Spain",
    flag: "es",
    value: "es",
  },
];

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

const onTabClick = (index: number = 0) => {
  selectedTab.value = index;
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.35s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.fade-left-enter-active {
  transition: all 0.35s ease 0.35s;
}

.fade-left-leave-active {
  transition: all 0.35s ease;
}

.fade-left-enter-from,
.fade-left-leave-to {
  opacity: 0;
  transform: translateX(5px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
