<script setup lang="ts">
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

// DESIGN STATUS:       ✴️
//   ✅ make every single part of the input/copy icon/button clickable to copy
//   * the inputgroup should also be set to text-subtle... but i dont like adding tons of "input-class, icon-class blah blah blah"
//   * after you style the color, the link should also be text-sm
//   ✅ after that... the input + copy icon ALSO needs cursor-pointer
// ARCHITECTURE STATUS: ✴️
//   ✅ implement real countdown (see on bet7k what happens when it runs out)
//   ✅ G branded QR is VERY FUCKING COOL and adds a serious bit of chrome
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ? (From Ivan: is this needed? There is no form to submit here, just waiting for WS message to be received)

const props = defineProps<{
  code: string;
  amount: number;
  currency: WalletCurrency;
  createNewDeposit: () => Promise<string>;
}>();

const siteStore = useSiteStore();

const COUNTDOWN_MS = 5 * 60 * 1000;
const countdownHasEnded = ref(false);
const loadingGenerateNewCode = ref(false);

const formatDuration = (minutes: number, seconds: number) => {
  return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
};

const onClickGenerateNewCode = async () => {
  loadingGenerateNewCode.value = true;
  await props.createNewDeposit();
  loadingGenerateNewCode.value = false;
};
</script>

<template>
  <BaseForm class="gap-4 items-center">
    <div class="w-full flex gap-4 flex-row items-center justify-between mb-4">
      <BaseButton type="button" variant="subtle" @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('deposit')">
        <BaseIcon
          name="lucide:arrow-left"
          :size="20"
        />
      </BaseButton>
      <div class="leading-snug flex-1">
        <h2 class="text-xl font-semibold">{{ $t('modal_payments.finalize_deposit') }}</h2>
        <h3 class="text-sm font-medium text-subtle">{{ $t('modal_payments.finalize_deposit_subtitle') }}</h3>
      </div>
      <NuxtImg
        class="w-[6rem] h-auto"
        :src="siteStore.getAssetPath('images/logos/pix.svg')"
        alt="Pix"
      />
    </div>

    <BaseCountdown
      v-slot="{ minutes, seconds }"
      class="w-full"
      :time="COUNTDOWN_MS"
      @end="countdownHasEnded = true"
    >
      <div v-if="!countdownHasEnded" class="text-center">
        <BaseCopy
          :value="code"
          :show-icon="false"
          class="w-full block space-y-4 cursor-pointer mb-2"
        >
          <template #default="{ copied }">
            <div>
              <QRCode class="mx-auto px-3 bg-white rounded-lg" :value="code" :size="225" />
            </div>

            <div class="text-4xl flex items-center justify-center font-bold bg-button-emphasis text-transparent bg-clip-text">
              <BaseCurrency :value="amount" :currency="currency" variant="ghost" />
            </div>

            <BaseInputGroup
              :model-value="code"
              autocomplete="off"
              placeholder-placement="default"
              :disabled="true"
              class="pointer-events-none text-subtle text-sm"
            >
              <template #suffix>
                <div class="ml-5 flex justify-center items-center">
                  <BaseCopy
                    :value="code"
                    :copied="copied"
                    :size="20"
                    :show-label="false"
                  />
                </div>
              </template>
            </BaseInputGroup>

            <BaseButton v-if="!countdownHasEnded" size="xl" class="w-full px-0">
              <div v-if="copied">{{ $t('button.copied_code') }}</div>
              <div v-else>{{ $t('button.copy_code', { remaining: formatDuration(minutes, seconds) }) }}</div>
            </BaseButton>
          </template>
        </BaseCopy>

        <BaseButton
          variant="ghost"
          size="md"
          class="text-subtle"
          @click="$dependencies.users.ui.emitCommandCloseUserActionModal.handle()"
        >
          {{ $t("button.completed_payment") }}
        </BaseButton>
      </div>

      <div v-if="countdownHasEnded" class="w-full text-center">
        <p class="w-full text-lg text-alert-error">{{ $t('modal_payments.finalize_deposit_code_has_expired') }}</p>
        <BaseButton
          size="xl"
          class="mt-4 w-full px-0"
          :loading="loadingGenerateNewCode"
          @click="onClickGenerateNewCode"
        >
          {{ $t("modal_payments.generate_new_code") }}
        </BaseButton>

        <BaseButton
          variant="ghost"
          size="md"
          class="text-subtle"
          @click="$dependencies.users.ui.emitCommandCloseUserActionModal.handle()"
        >
          {{ $t("button.cancel_deposit") }}
        </BaseButton>
      </div>
    </BaseCountdown>
  </BaseForm>
</template>
