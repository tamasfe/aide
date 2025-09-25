import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export type PaymentLimitTimeframe = CamelizeKeys<components["schemas"]["PaymentLimitsTimeframeResponse"]>;
export type PaymentLimits = {
  depositCooldown?: components["schemas"]["DurationSeconds"] | null;
  depositMax?: components["schemas"]["SystemAmount"] | null;
  depositMin?: components["schemas"]["SystemAmount"] | null;
  timeframeLimits: PaymentLimitTimeframe[];
  withdrawalCooldown?: components["schemas"]["DurationSeconds"] | null;
  withdrawalMax?: components["schemas"]["SystemAmount"] | null;
  withdrawalMin?: components["schemas"]["SystemAmount"] | null;
};
