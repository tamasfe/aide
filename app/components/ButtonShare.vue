<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// ARCHITECTURE STATUS:       ✴️
//   - TODO Priority of checking installed apps (see below for order)
// NOTE this may not be allowed in common browsers....... if its hacky/doesnt work
// we may have to just always choose whatsapp... and maybe change whats most
// popular based on jurisdiction
// it also seems t.me is the preferred way not telegram://
// https://stackoverflow.com/a/74333181/794481

const props = defineProps<{
  subject: string;
  body: string;
  class?: HTMLAttributes["class"];
}>();

// make computed based on what they have installed
const icon = ref("ph:whatsapp-logo");
// ph:telegram-logo
// ph:mail

const onShare = () => {
  // whatsapp
  // telegram
  window.location.href = `mailto:?subject=${encodeURIComponent(props.subject)}&body=${encodeURIComponent(props.body)}`;
};
</script>

<template>
  <BaseButton
    variant="ghost"
    size="ghost"
    :class="cn(
      'flex flex-row gap-1 items-center',
      props.class,
    )"
    @click="onShare"
  >
    <Icon
      :name="icon"
      size="28"
    />
    <div>{{ $t("button.share") }}</div>
  </BaseButton>
</template>
