<template>
  <div class="header__wrapper flex justify-center w-full fixed bg-black h-[52px] top-0 left-0 z-[998]">
    <div class="flex place-content-between w-full max-w-[1296px] px-[32px] items-center">
      <div>
        <img src="/girobet-logo.svg" alt="Girobet logo">
      </div>
      <div class="flex gap-x-4">
        <PartialsButtonComponent variant="text" text="LOG IN" />
        <PartialsButtonComponent variant="solid" text="REGISTER"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
  .header {
    &__wrapper {
      &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        height: 1px;
        width: 100%;
        background-color: rgba(255,255,255, 0.15);
      }
    }
  }
</style>
