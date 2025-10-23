<!--
Read Setup.md for more information about this file
 -->
<script setup lang="ts">
const store = useSiteStore();

const licenseStatus = ref(store.activeAnjouanLicenseData);

onMounted(() => {
  store.activateAnjouanLicenseIfAvailable();
});
</script>

<template>
  <div
    v-show="licenseStatus?.divData"
    :id="licenseStatus?.divData.id"
    :data-anj-seal-id="licenseStatus?.divData.anjSealId"
    data-anj-image-size="128"
    data-anj-image-type="basic-small"
    class="flex items-center justify-center"
  />
</template>
