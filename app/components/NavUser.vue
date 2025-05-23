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
      buttonOnClick: () => $dependencies.common.asyncMessagePublisher.emit("frontend:commands:modals:open-live-chat", {}),
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
      v-slot="{ open, close }"
      class="relative"
    >
      <PopoverOverlay class="fixed inset-0 bg-transparent" />
      <PopoverButton
        :class="cn(
          'p-4 flex items-center text-subtle hover:text-emphasis transition-colors duration-200 focus-visible:outline-none',
          open && 'text-emphasis',
        )"
      >
        <BaseIcon
          name="material-symbols:account-circle"
          :size="26"
          class="align-middle"
        />
      </PopoverButton>
      <transition
        :duration="50"
        enter-active-class="transition ease-out"
        enter-from-class="translate-y-1 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-1 opacity-0"
      >
        <PopoverPanel class="absolute right-[1px] z-10">
          <div
            class="flex flex-col py-2 bg-emphasis/85 backdrop-blur-2xl rounded"
          >
            <div
              v-for="item in links"
              :key="item.key"
              class="text-subtle-light hover:text-white transition-colors duration-[50ms]"
            >
              <BaseLink
                v-if="item.action.toPage"
                :to="item.action.toPage"
                class="border-emphasis px-5 h-10 flex items-center whitespace-nowrap"
                @click="close"
              >
                <BaseIcon
                  :name="item.icon"
                  :size="18"
                  class="flex-shrink-0"
                />
                <span class="block w-full ml-4"> {{ item.title }}
                </span>
              </BaseLink>
              <BaseButton
                v-if="item.action.buttonOnClick"
                variant="ghost"
                type="button"
                class="border-emphasis px-5 h-10 flex items-center justify-start whitespace-nowrap font-normal w-full"
                @click="item.action.buttonOnClick"
              >
                <BaseIcon
                  :name="item.icon"
                  :size="18"
                  class="flex-shrink-0"
                />
                <span class="block ml-4"> {{ item.title }} </span>
              </BaseButton>
            </div>
          </div>
        </PopoverPanel>
      </transition>
    </Popover>
  </div>
</template>
