<script setup lang="ts">
import { PhCopy, PhWhatsappLogo } from "@phosphor-icons/vue";

const link = ref("https://girobet.com/invite/123456");
</script>

<template>
  <form class="flex flex-col justify-center gap-4 sm:h-full w-full">
    <h2 class="text-2xl font-semibold">Invite Friends, Earn Money</h2>
    <p class="text-subtle text-lg">
      Receive cash balance for every friend you refer.
    </p>
    <FormControl
      :model-value="link"
      class="w-full"
      type="number"
      title="Your referral code"
      wrapper-class="bg-subtle text-lg"
      input-class="text-emphasis"
    >
      <template #suffix>
        <button
          type="button"
          class="outline-none text-subtle"
        >
          <PhCopy :size="24" />
        </button>
      </template>
    </FormControl>
    <BaseButton
      class="w-full inline-flex justify-center"
      variant="primary"
      type="submit"
      big
    >
      <template #prefix>
        <PhWhatsappLogo :size="30" />
      </template>
      <p>Share via WhatsApp</p>
    </BaseButton>
  </form>
</template>
