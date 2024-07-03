<template>
  <div class="flex items-center gap-4">
    <h3 class="sm:text-xl font-bold">🏆 Winning Now:</h3>
    <div
      class="flex-1 flex items-center gap-4 overflow-x-auto giro__hide-scroll"
    >
      <GameWinner
        v-for="idx in 10"
        :key="idx"
        class="min-w-[90%] sm:min-w-[20%]"
      />
    </div>
  </div>
</template>
