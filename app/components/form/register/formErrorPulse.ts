import { inject, provide, ref, type Ref } from "vue";

export const RegisterFormErrorPulseKey: unique symbol = Symbol("RegisterFormErrorPulseKey");

type RegisterFormErrorPulseProvider = {
  isPulsing: Ref<boolean>;
  pulse: () => void;
};

const PULSE_DURATION_MS = 1000;
export function provideRegisterFormErrorPulse(): RegisterFormErrorPulseProvider {
  const isPulsing = ref(false);
  const pulse = () => {
    isPulsing.value = true;
    setTimeout(() => {
      isPulsing.value = false;
    }, PULSE_DURATION_MS);
  };
  provide(RegisterFormErrorPulseKey, isPulsing);
  return { isPulsing, pulse };
}

export function useRegisterFormErrorIsPulsing(): Ref<boolean | null> {
  return inject<Ref<boolean | null>>(RegisterFormErrorPulseKey, ref(null));
}
