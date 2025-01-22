<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { AbstractExtendedError } from "~/packages/result";

const { $dependencies } = useNuxtApp();

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
  url: string;
  class?: HTMLAttributes["class"];
}>();

const shareData = computed<ShareData>(() => ({
  title: props.subject,
  text: props.body,
  url: props.url,
}));

class ErrorSharing extends AbstractExtendedError {
  override name = "ErrorSharing" as const;

  // Possible share error types and their descriptions: @https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share
  public get type() {
    if (this.cause.name === "InvalidStateError") return "InvalidStateError";
    if (this.cause.name === "NotAllowedError") return "NotAllowedError";
    if (this.cause.name === "TypeError") return "TypeError";
    if (this.cause.name === "AbortError") return "AbortError";
    if (this.cause.name === "DataError") return "DataError";
    return "UnknownError";
  }

  constructor(metadata: Record<string, unknown>, error: unknown) {
    super("Error sharing the content", metadata, AbstractExtendedError.parseCause(error));
  }
}

const onShare = async () => {
  try {
    await navigator.share(shareData.value);
  }
  catch (error) {
    const errorSharing = new ErrorSharing({ shareData: shareData.value }, error);

    switch (errorSharing.type) {
      case "AbortError":
        // The user canceled the share, no need to log in error level
        $dependencies.common.logger.warn("Share was aborted", { shareData: shareData.value });
        return;

      default:
        $dependencies.common.logger.error("Error sharing the content", errorSharing);
    }
  }
};
</script>

<template>
  <BaseButton
    variant="ghost"
    size="ghost"
    :class="cn(
      'flex flex-row gap-1 items-center hover:text-subtle-light p-3 -m-2',
      props.class,
    )"
    @click="onShare"
  >
    <BaseIcon
      name="lucide:send"
      :size="20"
    />
  </BaseButton>
</template>
