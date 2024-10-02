<template>
  <NuxtLayout name="carousel">
    <div class="giro__container giro__sections">
      <SearchPopover />

      <WinningNow />

      <GridHorizontalGames category-identifier="blackjack" />
      <GridHorizontalGames category-identifier="table" />
      <GridHorizontalGames category-identifier="live" />

      <GridHorizontalProviders />
    </div>
  </NuxtLayout>
</template>
