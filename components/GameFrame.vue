<template>
  <div ref="gameWindow" class="relative w-full h-[561px] bg-[#2F323C] mt-[15px] rounded overflow-hidden">
    <div class="flex absolute bottom-0 left-0 w-full bg-[#232630] h-[60px] p-3 place-content-between">
      <div class="flex items-center p-2 hover:bg-[#1C1E28] rounded cursor-pointer text-white font-montserrat text-sm transition">
        <img src="/icons/chevron-down.svg" class="rotate-90">
        <span>Wild Spin</span>
      </div>
      <div class="flex items-center gap-x-2">
        <div class="inline-flex text-white cursor-pointer hover:text-opacity-100 mr-3">
          <img src="/icons/thumbs-up.svg" class="mr-2">
          123123
        </div>
        <div class="inline-flex text-white text-opacity-60 cursor-pointer hover:text-opacity-100 mr-4">
          <img src="/icons/thumbs-up.svg" class="rotate-180 opacity-60">
        </div>

        <div class="p-2 bg-[#1C1E28] rounded cursor-pointer" @click="onFullscreen()">
          <img src="/icons/maximize.svg" class="size-[18px]">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const gameWindow:Ref = ref(null)

const onFullscreen = () => {
  const elem = gameWindow.value
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch((err:any) => {
      alert(
        `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`,
      );
    });
  } else {
    document.exitFullscreen();
  }
}
</script>