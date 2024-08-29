### Refactor

Turik
  * hydration mismatches?
  * search source for all image sources and make them in assets (not in public), figure out better multiple loading images dynamically
    * delete icons folder and make those logos just a standard svg image loaded better
    * find dynamic way to load
    * load stuff from assets
    * delete junk in public
  * floating label
  * clean up tailwind variables
    * better naming like catpuccin with subtext, overlay, surface, base, mantle, crust (https://github.com/catppuccin/nvim/blob/main/lua/catppuccin/palettes/mocha.lua)
    * remove bg-text-emphasis bullshit (and the other bg-text one) and also remove it from carousel when hes done refactoring that
  * fix animations
    * use to fine tune everything? https://github.com/jamiebuilds/tailwindcss-animate/blob/main/docs/animation-play-state.md
    * other component cant remember has a comment about animation
    * drawer/modal anywhere there is animation
    * button animation fade (see comment)
  * refactor / clean up your existing components

Todo
  * spacing
    * get rid of weird spacing on carousel
    * add more space under carousel ... maybe game winners
  * finalize game grid # of columns @ different screen sizes
  * all pages (other folders)
  * components
  * disable animation for signup/login/modals like bet7k (make it optional)
  * replace all @phosphor-icons/vue
  * providers page


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
