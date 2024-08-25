### Refactor

  * MASSIVELY refactor TW variables. remove fucking tailwind variables.....................
  * components
  * remove bg-text-emphasis bullshit (and the other bg-text one) and also remove it from carousel when hes done refactoring that
  * layouts (all the margins/paddings on pages... finalize them all so we have solid sections/layouts/normalized paddings across layouts/app.vue/pages)
  * BaseButton / button (delete old button)
    * add loading spinner to large/medium button
    * search and destroy all "btn" stuff
  * search source for all image sources and make them in assets (not in public)
  * disable animation for signup/login/modals like bet7k (make it optional)
  * all pages
  * finalize game grid # of columns @ different screen sizes
  * put typeCheck back at true
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
  - InfoWithdrawal.vue
form
  - Deposit.vue
  - DepositPix.vue
  - ForgotPassword.vue
  - Invite.vue
  - Login.vue
  - RegisterBrazil.vue
  - WithdrawPix.vue
modal
  - Deposit.vue
  - Invite.vue
  - Withdraw.vue
wrapper
  - Deposit.vue
  - Withdraw.vue
