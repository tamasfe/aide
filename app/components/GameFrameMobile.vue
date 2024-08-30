<script setup lang="ts">
// DESIGN STATUS:        ✅
// ARCHITECTURE STATUS:  ✅

const authenticated = ref(false);
</script>

<template>
  <div class="flex flex-col">
    <GameFrameBackdrop
      :authenticated="authenticated"
      class="h-[60vh]"
    >
      <template #authenticated>
        <div class="absolute top-0 left-0 w-full h-full z-[10]">
          <GameFrameIframe />
        </div>
      </template>

      <div
        class="w-full h-full p-6 flex flex-col justify-between"
      >
        <div class="w-full flex flex-row items-center justify-start gap-6">
          <ImageRatio
            src="/assets/images/games/3.png"
            class="w-[7rem] rounded-default"
          />
          <div class="flex flex-col gap-1">
            <h2 class="text-2xl font-semibold">Potion Spells</h2>
            <h3 class="text-lg text-subtle-light font-medium">Pragmatic Play</h3>
            <GameFrameVotes class="mt-4 gap-4 text-subtle-light" />
          </div>
        </div>
        <div class="w-full">
          play
        </div>
      </div>

      <!-- <div class="h-full flex flex-col justify-between space-y-4"> -->
      <!--   <div -->
      <!--     class="grid grid-cols-3 place-items-center space-x-8 text-emphasis" -->
      <!--   > -->
      <!--     <div -->
      <!--       class="relative w-full rounded-default overflow-hidden pb-[136.36%]" -->
      <!--     > -->
      <!--       <NuxtImg -->
      <!--         src="https://picsum.photos/200/300" -->
      <!--         alt="" -->
      <!--         class="absolute left-0 top-0 w-full h-full object-cover" -->
      <!--       /> -->
      <!--     </div> -->
      <!--     <div class="col-span-2 w-full flex flex-col space-y-6"> -->
      <!--       <div class="flex flex-col"> -->
      <!--         <h3 class="text-default text-[1.487rem] font-bold"> -->
      <!--           Potion Spells -->
      <!--         </h3> -->
      <!--         <p class="text-xl text-emphasis font-medium"> -->
      <!--           {{ $t("play.by_provider", { provider: "TODO" }) }} -->
      <!--         </p> -->
      <!--       </div> -->
      <!--       <div class="flex items-center space-x-4 font-semibold"> -->
      <!--         <button -->
      <!--           type="button" -->
      <!--           class="outline-none inline-flex items-center space-x-2 text-emphasis" -->
      <!--         > -->
      <!--           <div> -->
      <!--             <PhThumbsUp :size="30" /> -->
      <!--           </div> -->
      <!--           <p class="text-lg">78% (2.250)</p> -->
      <!--         </button> -->
      <!--         <button -->
      <!--           type="button" -->
      <!--           class="outline-none inline-flex text-emphasis" -->
      <!--         > -->
      <!--           <div> -->
      <!--             <PhThumbsDown :size="30" /> -->
      <!--           </div> -->
      <!--         </button> -->
      <!--       </div> -->
      <!--     </div> -->
      <!--   </div> -->
      <!--   <div class="grid grid-cols-3 gap-x-8 place-items-center"> -->
      <!--     <button -->
      <!--       type="button" -->
      <!--       class="outline-none inline-flex space-x-2 text-emphasis" -->
      <!--     > -->
      <!--       <PhWhatsappLogo :size="24" /> -->
      <!--       <p class="text-lg font-semibold">{{ $t("play.share") }}</p> -->
      <!--     </button> -->
      <!--     <BaseButton -->
      <!--       class="col-span-2 inline-flex justify-center w-full py-2" -->
      <!--       variant="primary" -->
      <!--       big -->
      <!--     > -->
      <!--       <template #prefix> -->
      <!--         <PhPlay :size="24" /> -->
      <!--       </template> -->
      <!--       <h1 class="text-2xl">Play</h1> -->
      <!--     </BaseButton> -->
      <!--   </div> -->
      <!-- </div> -->
    </GameFrameBackdrop>
  </div>
</template>
