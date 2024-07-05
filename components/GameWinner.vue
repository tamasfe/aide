<template>
  <div
    class="bg-subtle grid grid-cols-3 gap-2 p-2 rounded-[0.8rem] cursor-pointer outline-none"
  >
    <!-- force aspect ration 3:3 -->
    <div class="relative pt-[100%] rounded-[0.8rem]">
      <NuxtImg
        src="https://picsum.photos/300/300?random=1"
        alt=""
        class="absolute left-0 top-0 w-full object-cover rounded-[0.8rem]"
      />
    </div>
    <div class="col-span-2 text-subtle text-[0.9rem]">
      <p class="bg-button-primary text-transparent bg-clip-text">$32.14</p>
      <p class="truncate">Golden rush inferno</p>
      <p>Rui***</p>
    </div>
  </div>
</template>
