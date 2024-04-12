<template>
  <div class="bg-body-bg min-h-screen">
    <PageHeader />
    <div class="mt-[50px]">
      <slot/>
    </div>
    <PageFooter />
    <AuthModal v-if="true"/>
  </div>
</template>
