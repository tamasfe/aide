<template>
  <div class="relative w-full">
    <div
      ref="inputWrapper"
      class="w-full max-w-[1232px] transition-[top] duration-500 z-[997]"
      :class="{
        'relative': focus,
        'scroll-mt-[103px]': !store.getPromoNotificationOpen,
        'scroll-mt-[74px]': !store.getPromoNotificationOpen
      }"
    >
      <input
        class=" w-full max-w-[1232px] rounded-full bg-[#2F323C] hover:brightness-90 transition-all text-sm font-montserrat text-white font-semibold p-[10px] outline-none pl-[36px] placeholder:text-white placeholder:opacity-80"
        :class="{'shadow-2xl': focus}"
        id="globalSearchInput"
        type="text"
        placeholder="Search for an account or provider by name"
        v-model="model"
        @focus="focus = true"
        @click="onSearchClick()"
      >
      <IconsSearchIcon class="absolute left-[10px] top-[12px]"/>
      <Transition>
        <label for="globalSearchInput" v-if="focus" class="absolute flex flex-col w-full h-[400px] bg-[#2F323C] mt-6 rounded-lg z-[998]">
          <div class="w-full flex gap-x-4 px-6 border-b-[2px] border-opacity-10 border-b-[#D9D9D9]">
            <div
              v-for="(category, index) in categories"
              class="px-[5px] py-4 text-white font-montserrat text-xs font-semibold text-opacity-60 hover:brightness-90 cursor-pointer mb-[-2px] border-b-[2px] border-opacity-0 hover:text-opacity-100 hover:border-opacity-100 border-b-[#FFE33A] transition duration-300"
              :class="{'text-opacity-100 border-b-[#FFE33A] border-opacity-100': index === selectedTab }"
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
              <TransitionGroup name="list" tag="div">
                <NuxtLink to="/" v-for="item in categories[selectedTab].items" class="w-full flex px-6 py-3 hover:bg-[#232630] transition">
                  <div class="w-[80px] h-[110px] bg-black rounded"></div>
                  <div class="flex flex-col flex-1 justify-center pl-4">
                    <p class="text-white font-montserrat font-semibold mb-1">
                      {{ item.title }}
                    </p>
                    <p class="text-white font-montserrat text-opacity-70 m-0">
                      {{ item.subtitle }}
                    </p>
                  </div>
                </NuxtLink>
              </TransitionGroup>
            </div>
          </div>
        </label>
      </Transition>
    </div>
    <Transition>
      <div v-if="focus" class="fixed left-0 top-0 size-full bg-[#0C0D0D] bg-opacity-65 z-[996] transition duration-500 cursor-pointer" @click="focus = false"></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const model = defineModel();
const focus = ref(false);
const store = useTriggersStore();

const categories = [
  {
    title: 'All',
    items: [
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      }
    ]
  },
  {
    title: 'Slots',
    items: [
      {
        title: 'Fortune double 2',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double 2',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double 2',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double 2',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double 2',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double 2',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double 2',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double 2',
        subtitle: 'Giro Originals',
        imageUrl: ''
      }
    ]
  },
  {
    title: 'Live Casino',
    items: [
      {
        title: 'Fortune double 3',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double 3',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double 3',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double 3',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double 3',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double 3',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double 3',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double 3',
        subtitle: 'Giro Originals',
        imageUrl: ''
      }
    ]
  },
  {
    title: 'Originals',
    items: [
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      },
      {
        title: 'Fortune double',
        subtitle: 'Giro Originals',
        imageUrl: ''
      }
    ]
  }
];

let selectedTab:Ref<number> = ref(0);

const inputWrapper:Ref = ref(null);

const onSearchClick = () => {
  inputWrapper.value.scrollIntoView({ behavior: "smooth" })
}

const onTabClick = (index:number = 0) => {
  selectedTab.value = index
}
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