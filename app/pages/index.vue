<template>
  <NuxtLayout name="carousel">
    <div class="giro__container giro__sections">
      <Search>
        <template #default>
          <WrapperScrollerGame />
        </template>
      </Search>

      <WinningNow />

      <WrapperScrollerGame />
      <WrapperScrollerGame />
      <WrapperScrollerGame />

      <WrapperScrollerProvider />
    </div>
  </NuxtLayout>
</template>
