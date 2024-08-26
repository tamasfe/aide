<script setup lang="ts">
const { t } = useI18n();

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * currently shows CPF for all jurisdictions and it needs to be BR only
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✴️

const error = ref("There was a problem");
const loading = ref(false);
</script>

<template>
  <BaseForm>
    <BaseAlert
      v-if="error"
      :message="error"
      level="error"
    />

    <BaseInputGroup
      :label="t('field.email')"
      autocomplete="email"
      inputmode="email"
    />

    <BaseInputGroup
      :label="t('field.password')"
      type="password"
      autocomplete="new-password"
    />

    <BaseInputGroup
      :label="t('field.cpf')"
      inputmode="numeric"
      mask="###.###.###-##"
    />

    <div class="mb-4 flex justify-end">
      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="text-sm text-subtle hover:text-subtle-light"
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

    <div class="mt-4 text-center text-sm text-subtle">
      {{ t("modal_auth.dont_have_account") }}

      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="text-primary hover:underline"
      >
        {{ t("modal_auth.create_free_account") }}
      </BaseButtonNew>
    </div>
  </BaseForm>
</template>

<!--     <BaseInputGroup -->
<!--       v-model="cpf" -->
<!--       type="text" -->
<!--       :title="t('field.cpf')" -->
<!--       class="w-full" -->
<!--       wrapper-class="bg-subtle sm:py-[0.4rem] rounded-[0.35rem]" -->
<!--       input-class="text-default" -->
<!--       inputmode="numeric" -->
<!--       :error="errors.cpf" -->
<!--       :maska="cpfMask" -->
<!--     /> -->
<!--     <BaseInputGroup -->
<!--       v-model="phone" -->
<!--       v-model:region="region" -->
<!--       type="tel" -->
<!--       :title="t('field.telephone')" -->
<!--       class="w-full" -->
<!--       wrapper-class="bg-subtle sm:py-[0.4rem] rounded-[0.35rem]" -->
<!--       input-class="text-default" -->
<!--       :error="errors.phone || errors.region" -->
<!--     /> -->
<!--     <p class="text-sm text-subtle py-4"> -->
<!--       {{ t("modal_auth.accept_terms") }} -->
<!--       <NuxtLink -->
<!--         to="/terms" -->
<!--         target="_blank" -->
<!--         class="font-semibold hover:text-subtle-light" -->
<!--       > -->
<!--         {{ t("page.terms") }} -->
<!--       </NuxtLink> -->
<!--     </p> -->
<!---->
<!--     <BaseButtonNew -->
<!--       :loading="isSubmitting" -->
<!--       :disabled="!meta.valid" -->
<!--       size="xl" -->
<!--       class="w-full" -->
<!--       type="submit" -->
<!--     > -->
<!--       {{ t("button.create_account") }} -->
<!--     </BaseButtonNew> -->
<!---->
<!--     <p class="text-subtle py-4"> -->
<!--       {{ t("modal_auth.have_account") }} -->
<!--       <BaseButtonNew -->
<!--         variant="ghost" -->
<!--         size="ghost" -->
<!--         class="font-semibold text-brand-yellow hover:underline" -->
<!--         @click="emit('request:login')" -->
<!--       > -->
<!--         {{ t("button.login") }} -->
<!--       </BaseButtonNew> -->
<!--     </p> -->
<!--   </form> -->
<!-- </template> -->
