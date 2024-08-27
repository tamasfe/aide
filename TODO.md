### Refactor

Turik
  * search source for all image sources and make them in assets (not in public), figure out better multiple loading images dynamically
  * fix animations (use tailwind animate?)
  * floating label

Todo
  * nuxt 4
  * add loading spinner to medium button
  * MASSIVELY refactor TW variables. remove fucking tailwind variables.....................
  * make all images load nicely, make some wrapper
  * components
  * remove bg-text-emphasis bullshit (and the other bg-text one) and also remove it from carousel when hes done refactoring that
  * layouts (all the margins/paddings on pages... finalize them all so we have solid sections/layouts/normalized paddings across layouts/app.vue/pages)
  * disable animation for signup/login/modals like bet7k (make it optional)
  * all pages
  * finalize game grid # of columns @ different screen sizes
  * replace all @phosphor-icons/vue
  * delete public images junk folder


### Components

account
  - Close.vue
  - MainDetails.vue
  - NavigationTab.vue
  - NavigationTabs.vue
  - PersonalDetails.vue
  - PixSettings.vue
  - RegionalSettings.vue
  - SettingContainer.vue
base
  - ContentBox.vue
  - GameDescriptionCard.vue
  - GameFrame.vue
  - GameFrameMobile.vue
  - GridCategory.vue
  - Search.vue
  - Select.vue
  - Skeleton.vue
