<script setup lang="ts">
import { useI18n } from "vue-i18n";

import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
} from "reka-ui";

defineOptions({
  inheritAttrs: false,
});

const { t } = useI18n();
const { $dependencies } = useNuxtApp();

const loadingLogout = ref(false);

const links = [
  {
    key: "wallet",
    title: t("user_nav.wallet"),
    icon: "lucide:wallet",
    action: { toPage: { name: "wallet" } },
  },
  {
    key: "history",
    title: t("user_nav.history"),
    icon: "lucide:table-properties",
    action: { toPage: { name: "wallet-deposits" } },
  },
  {
    key: "account_settings",
    title: t("user_nav.account_settings"),
    icon: "lucide:cog",
    action: { toPage: { name: "settings-account" } },
  },
  {
    key: "live_support",
    title: t("user_nav.live_support"),
    icon: "lucide:message-circle-question",
    action: {
      buttonOnClick: () =>
        $dependencies.common.asyncMessagePublisher.emit(
          "frontend:commands:modals:open-live-chat",
          {},
        ),
    },
  },
  {
    key: "logout",
    title: t("user_nav.logout"),
    icon: "lucide:log-out",
    action: {
      buttonOnClick: async () => {
        loadingLogout.value = true;
        await $dependencies.users.ui.logoutCurrentUserFromButtonClick.handle();
        loadingLogout.value = false;
      },
    },
  },
];
</script>

<template>
  <PopoverRoot v-slot="{ open, close }">
    <PopoverTrigger
      v-bind="$attrs"
      :class="cn(
        'h-14 px-4 flex items-center text-subtle md:hover:text-emphasis transition-colors duration-200 focus-visible:outline-none flex-shrink-0',
        open && 'text-emphasis',
      )"
      aria-label="User menu"
    >
      <BaseIcon
        name="material-symbols:account-circle"
        :size="26"
        class="align-middle"
      />
    </PopoverTrigger>

    <Transition name="menu-pop" appear>
      <PopoverContent
        side="bottom"
        align="end"
        position-strategy="absolute"
        :side-offset="4"
        :collision-padding="4"
        class="z-[40] rounded bg-emphasis"
      >
        <div class="flex flex-col py-2">
          <div
            v-for="item in links"
            :key="item.key"
            class="text-subtle-light md:hover:text-white transition-colors duration-[50ms]"
          >
            <!-- Route link -->
            <NuxtLinkLocale
              v-if="item.action.toPage"
              :to="item.action.toPage"
              class="border-emphasis px-5 h-10 flex items-center whitespace-nowrap"
              @click="close()"
            >
              <BaseIcon :name="item.icon" :size="18" class="flex-shrink-0" />
              <span class="block w-full ml-4">{{ item.title }}</span>
            </NuxtLinkLocale>

            <!-- Buttons / actions -->
            <BaseButton
              v-else
              :loading="item.key === 'logout' ? loadingLogout : false"
              variant="ghost"
              type="button"
              class="border-emphasis px-5 h-10 flex items-center justify-start whitespace-nowrap font-normal w-full"
              @click="(item.action.buttonOnClick?.(), close())"
            >
              <BaseIcon :name="item.icon" :size="18" class="flex-shrink-0" />
              <span class="block ml-4">{{ item.title }}</span>
            </BaseButton>
          </div>
        </div>
      </PopoverContent>
    </Transition>
  </PopoverRoot>
</template>

<style>
/* Overlay fade */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity .15s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}

/* Panel pop */
.menu-pop-enter-active,
.menu-pop-leave-active {
  transition:
    opacity .16s cubic-bezier(.16,1,.3,1);
}
.menu-pop-enter-from,
.menu-pop-leave-to {
  opacity: 0;
  transform: scale(.98);
}
</style>
