<script setup lang="ts">
const search = ref("");
</script>

<template>
  <div>
    <CarouselHero />

    <div class="giro__container giro__section">
      <!-- TODO this gap-8 should potentially be giro_section but multiple times -->
      <!-- find better way to do common containers/common space-y-X -->
      <div class="flex flex-col gap-8">
        <Search
          v-model="search"
          class="w-full"
        >
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
    </div>
  </div>
</template>
