<template>
  <NuxtLayout name="carousel">
    <div class="giro__container giro__sections">
      <SearchPopover />

      <WinningNow />

      <GridHorizontalGames category-identifier="top-games" />
      <GridHorizontalGames category-identifier="popular-games" />
      <GridHorizontalGames category-identifier="exclusive-games" />

      <GridHorizontalProviders />
    </div>
  </NuxtLayout>
</template>
