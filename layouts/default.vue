<script setup>
import { Button } from "#components";
</script>

<template>
  <div class="h-screen bg-default text-default">
    <div class="p-6 flex items-center space-x-4 bg-subtle">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="emphasis">Emphasis</Button>
    </div>
    <div class="p-6 flex items-center space-x-4 bg-subtle">
      <Button variant="primary" big shadow border>START</Button>
      <Button variant="secondary" big>SOMETHING </Button>
      <Button variant="emphasis" big shadow border>DEPOSIT</Button>
    </div>
    <slot />
  </div>
</template>
