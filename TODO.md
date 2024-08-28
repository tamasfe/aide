### Refactor

Turik
  * hydration mismatches?
  * firefox bug
    * any other firefix/safari glitches/weirdness
  * floating label
  * clean up tailwind variables
    * better naming like catpuccin with subtext, overlay, surface, base, mantle, crust (https://github.com/catppuccin/nvim/blob/main/lua/catppuccin/palettes/mocha.lua)
    * remove bg-text-emphasis bullshit (and the other bg-text one) and also remove it from carousel when hes done refactoring that
  * search source for all image sources and make them in assets (not in public), figure out better multiple loading images dynamically
    * find dynamic way to load
    * load stuff from assets
    * delete junk in public
  * fix animations
    * use to fine tune everything? https://github.com/jamiebuilds/tailwindcss-animate/blob/main/docs/animation-play-state.md
    * other component cant remember has a comment about animation
    * drawer/modal anywhere there is animation
    * button animation fade (see comment)
  * refactor / clean up your existing components

Todo
  * finalize game grid # of columns @ different screen sizes
  * all pages (other folders)
  * layouts (all the margins/paddings on pages... finalize them all so we have solid sections/layouts/normalized paddings across layouts/app.vue/pages)
  * components
  * disable animation for signup/login/modals like bet7k (make it optional)
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
