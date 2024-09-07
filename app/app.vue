<script setup lang="ts">
import validarCpf from "validar-cpf";
// ^ missing index.d.ts exists in repo but not in npm. i made an issue: https://github.com/guilhermehn/validar-cpf/issues/338#issuecomment-2336333240

// TODO turn me into a test
const cpfs = ["839.853.700-01", "456.963.660-82", "463.602.910-02", "351.014.950-50", "666.571.090-40", "862.109.040-68", "877.716.820-81", "564.336.720-35", "178.370.040-86", "612.135.060-18", "685.484.820-28", "714.827.730-23", "551.435.860-70", "598.325.110-46", "882.862.860-06", "354.198.240-35", "830.813.150-69", "814.547.280-60", "711.750.850-73", "378.912.940-20", "006.893.130-12", "239.798.810-08", "317.171.240-70", "140.270.500-02", "980.059.980-07", "753.341.670-80", "015.320.700-04", "124.112.860-07", "928.293.900-67", "979.943.540-41", "446.275.760-21", "704.709.680-95", "240.148.690-91", "094.360.250-50", "947.456.920-72", "157.091.870-89", "388.974.970-47", "529.894.310-12", "571.066.940-70", "239.906.190-04", "831.236.320-32", "362.383.470-07", "459.492.010-19", "677.748.660-78", "801.949.030-28", "941.494.530-04", "358.324.520-20", "508.507.590-05", "043.487.160-56", "509.734.140-65", "971.727.520-31", "472.388.790-34", "162.706.500-89", "669.579.640-86", "517.909.270-13", "693.028.510-28", "584.707.320-80", "305.547.120-24", "230.991.750-80", "517.002.820-26", "698.407.340-59", "019.868.080-50", "592.008.960-14", "745.689.080-35", "004.450.820-46", "987.104.840-86", "697.300.150-58", "793.281.160-07", "980.286.150-23", "435.479.770-45", "067.674.790-63", "994.406.170-04", "569.358.600-67", "290.108.900-31", "821.316.650-75", "400.096.500-08", "174.885.760-63", "473.527.920-23", "589.507.850-80", "601.120.310-80", "729.135.240-10", "323.271.990-26", "175.295.760-11", "810.994.990-89", "303.788.900-42", "425.636.990-29", "294.596.640-91", "479.207.230-19", "345.199.680-46", "065.609.740-06", "456.656.100-38", "134.836.280-45", "339.364.620-62", "873.440.610-74", "149.408.730-80", "098.400.870-53", "196.680.040-19", "814.468.540-78", "819.540.360-35", "161.126.160-09"];
cpfs.forEach((cpf) => {
  console.log(validarCpf(cpf));
});

const { t } = useI18n();

const modal = ref("");

// TODO: we need to show this console warning to users like facebook does.
// we ideally should show it after 1-2 seconds so all the junk requests have time to
// clear first, that way they actually see it. also.. it should go in a better spot
setTimeout(() => {
  consoleWarning(t("console_warning.title"), "danger");
  consoleWarning(t("console_warning.description"));
}, 600);

const { $dependencies } = useNuxtApp();
$dependencies.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-login",
  () => {
    modal.value = "login";
  },
);
</script>

<template>
  <div>
    <NavSidebar />

    <ModalLogin v-if="modal === 'login'" />
    <ModalRegister v-if="modal === 'register'" />
    <ModalForgotPassword v-if="modal === 'forgot'" />
    <ModalCancelRegistration v-if="modal === 'cancel_reg'" />
    <ModalDeposit v-if="modal === 'deposit'" />
    <ModalDepositConfirm v-if="modal === 'deposit_confirm'" />
    <ModalWithdrawal v-if="modal === 'withdrawal'" />
    <ModalRestrictExpanding v-if="modal === 'restrict_expanding'" />
    <ModalRestrictLicenseAlternative
      v-if="modal === 'restrict_license_alternative'"
    />
    <ModalRestrictLicenseNoAlternative
      v-if="modal === 'restrict_license_no_alternative'"
    />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
