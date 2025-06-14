<script setup lang="ts">
import snsWebSdk from "@sumsub/websdk";

const loading = ref(true);

const props = defineProps<{
  initialAccessToken: string;
  applicant: {
    email: string;
    phone: string;
    language: string;
  };
  renewAccessToken: () => Promise<string>;
}>();

const emits = defineEmits<{
  (e: "submitted"): void;
  (e: "error", error: { error: string; code: string }): void;
}>();

const CONTAINER_ID = "sumsub-websdk-container";

/**
 * This was highly inspired by the official documentation: https://docs.sumsub.com/docs/get-started-with-web-sdk
 *
 * @param accessToken - access token that you generated on the backend
 * @param applicantEmail - applicant email (not required)
 * @param applicantPhone - applicant phone (not required)
 * @param customI18nMessages - customized locale messages for current session (not required)
 */
function launchWebSdk(accessToken: string, _applicantEmail: string, _applicantPhone: string, _applicantLanguage: string) {
  const snsWebSdkInstance = snsWebSdk
    .init(
      accessToken,
      // token update callback, must return Promise. Access token expired: get a new one and pass it to the callback to re-initiate the WebSDK
      () => props.renewAccessToken(),
    )
    .withConf({
      theme: "dark", // "dark" | "light",
    })
    .withOptions({ addViewportTag: false, adaptIframeHeight: true })
  // see below what kind of messages WebSDK generates
    .on("idCheck.onApplicantSubmitted", () => emits("submitted"))
    .on("idCheck.onApplicantResubmitted", () => emits("submitted"))
    .on("idCheck.onReady", () => loading.value = false)
    .on("idCheck.onError", (error) => {
      emits("error", error);
    })
    .build();

  // you are ready to go:
  // just launch the WebSDK by providing the container element for it
  snsWebSdkInstance.launch(`#${CONTAINER_ID}`);
}

onMounted(() => {
  launchWebSdk(props.initialAccessToken, props.applicant.email, props.applicant.phone, props.applicant.language);
});
</script>

<template>
  <div>
    <div v-if="loading" class="py-16">
      <BaseSpinner
        class="text-subtle mx-auto 6"
        :size="32"
      />
    </div>

    <div v-show="!loading" :id="CONTAINER_ID" />
  </div>
</template>
