<script setup lang="ts">
import {
  Popover,
  PopoverButton,
  PopoverOverlay,
  PopoverPanel,
} from "@headlessui/vue";

// DESIGN STATUS:       ✴️
//   * close popup when clicking

const { t } = useI18n();
const { $dependencies } = useNuxtApp();

const onClickLogout = async () => $dependencies.users.ui.logoutCurrentUserFromButtonClick.handle();

const links = [
  {
    key: "wallet",
    title: t("user_nav.wallet"),
    icon: "lucide:wallet",
    action: {
      toPage: { name: "settings-wallet" },
    },
  },
  {
    key: "history",
    title: t("user_nav.history"),
    icon: "lucide:table-properties",
    action: {
      toPage: { name: "history-deposits" },
    },
  },
  {
    key: "account_settings",
    title: t("user_nav.account_settings"),
    icon: "lucide:cog",
    action: {
      toPage: { name: "settings-account" },
    },
  },
  {
    key: "live_support",
    title: t("user_nav.live_support"),
    icon: "lucide:message-circle-question",
    action: {
      toPage: { name: "todo" },
    },
  },
  {
    key: "logout",
    title: t("user_nav.logout"),
    icon: "lucide:log-out",
    action: {
      buttonOnClick: onClickLogout,
    },
  },
];
</script>

<template>
  <div>
    <Popover
      v-slot="{ open }"
      class="relative"
    >
      <PopoverOverlay class="fixed inset-0 bg-transparent" />
      <PopoverButton
        :class="cn(
          'px-2 h-9 md:h-10 text-subtle hover:text-emphasis focus-visible:outline-none',
          open && 'text-emphasis',
        )"
      >
        <Icon
          name="material-symbols:account-circle"
          size="28"
          class="align-middle"
        />
      </PopoverButton>

      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <PopoverPanel class="absolute right-0 z-10 mt-4">
          <div class="flex flex-col py-2 bg-emphasis/85 backdrop-blur-xl rounded-default">
            <div
              v-for="item in links"
              :key="item.key"
            >
              <NuxtLink
                v-if="item.action.toPage"
                :to="item.action.toPage"
                class="border-emphasis px-6 h-10 min-w-[14rem] flex items-center text-emphasis hover:text-white whitespace-nowrap"
              >
                <Icon
                  :name="item.icon"
                  size="22"
                  class="flex-shrink-0 text-subtle"
                />
                <span class="block w-full ml-4 text-[0.85rem]">
                  {{ item.title }}
                </span>
              </NuxtLink>

              <BaseButton
                v-if="item.action.buttonOnClick"
                variant="ghost"
                type="button"
                class="border-emphasis px-6 h-10 min-w-[14rem] flex items-center justify-start text-emphasis hover:text-white whitespace-nowrap font-normal w-full"
                @click="item.action.buttonOnClick"
              >
                <Icon
                  :name="item.icon"
                  size="22"
                  class="flex-shrink-0 text-subtle"
                />
                <span class="block ml-4 text-[0.85rem]">
                  {{ item.title }}
                </span>
              </BaseButton>
            </div>
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
  </div>
</template>
