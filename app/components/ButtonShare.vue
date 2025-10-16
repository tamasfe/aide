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
  public type: string;

  constructor(metadata: Record<string, unknown>, error: unknown) {
    super("Error sharing the content", metadata, AbstractExtendedError.parseCause(error));

    switch (this.cause.name) {
      case "InvalidStateError":
        if (this.cause.message.includes("Failed to execute 'share' on 'Navigator': An earlier share has not yet completed") || this.cause.message.includes("Other sharing operations are in progress")) {
          this.type = "InvalidStateError.ShareInProgress";
          break;
        }
        this.type = "InvalidStateError";
        break;
      case "NotAllowedError":
        this.type = "NotAllowedError";
        break;
      case "TypeError":
        this.type = "TypeError";
        break;
      case "AbortError":
        this.type = "AbortError";
        break;
      case "DataError":
        this.type = "DataError";
        break;
      default:
        this.type = "UnknownError";
    }
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
        $dependencies.common.logger.warn("Share was aborted. Tolerating...", { shareData: shareData.value });
        return;

      case "InvalidStateError.ShareInProgress":
        // The user is already seeing the share, no need to log in error level
        $dependencies.common.logger.warn("Share already in progress. Tolerating...", { shareData: shareData.value });
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
      'flex flex-row gap-1 items-center md:hover:text-subtle-light p-3 -m-2',
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
