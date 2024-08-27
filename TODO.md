### Refactor

Turik
  * floating label
  * clean up tailwind variables
    * remove bg-text-emphasis bullshit (and the other bg-text one) and also remove it from carousel when hes done refactoring that
  * search source for all image sources and make them in assets (not in public), figure out better multiple loading images dynamically
    * find dynamic way to load
    * load stuff from assets
    * delete junk in public
  * fix animations (use tailwind animate?)
    * other component cant remember has a comment about animation
    * drawer/modal anywhere there is animation
    * button animation fade (see comment)
  * refactor / clean up your existing components

Todo
  * nuxt 4
  * make all images load nicely, make some wrapper
  * components
  * layouts (all the margins/paddings on pages... finalize them all so we have solid sections/layouts/normalized paddings across layouts/app.vue/pages)
  * disable animation for signup/login/modals like bet7k (make it optional)
  * all pages (other folders)
  * finalize game grid # of columns @ different screen sizes
  * replace all @phosphor-icons/vue


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
