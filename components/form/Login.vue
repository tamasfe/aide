<script setup lang="ts">
const { t } = useI18n();

const error = ref("There was a problem");
const loading = ref(true);
</script>

<template>
  <form>
    <BaseAlert
      v-if="error"
      :message="error"
      level="error"
    />

    <FormControl
      type="email"
      :title="t('field.email')"
      class="w-full"
      wrapper-class="bg-subtle sm:py-[0.4rem]"
      input-class="text-default"
      autocomplete="email"
    />
    <FormControl
      type="password"
      :title="t('field.password')"
      class="w-full"
      wrapper-class="bg-subtle sm:py-[0.4rem]"
      input-class="text-default"
      autocomplete="new-password"
    />
    <div class="py-4">
      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="font-semibold text-subtle hover:text-subtle-light"
      >
        {{ t("modal_auth.forgot_password") }}
      </BaseButtonNew>
    </div>

    <BaseButtonNew
      :loading="loading"
      :disabled="loading"
      size="xl"
      class="w-full"
    >
      {{ t("button.login") }}
    </BaseButtonNew>

    <div class="text-sm text-subtle py-4">
      {{ t("modal_auth.dont_have_account") }}

      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="font-semibold hover:underline"
      >
        {{ t("modal_auth.create_free_account") }}
      </BaseButtonNew>
    </div>
  </form>
</template>
