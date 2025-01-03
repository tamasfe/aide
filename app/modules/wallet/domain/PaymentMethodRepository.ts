import type { PaymentMethodI, PaymentMethodIdentifier } from "./PaymentMethod";
import type { ErrorPaymentMethodNotFound } from "./ErrorPaymentMethodNotFound";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export interface PaymentMethodRepositoryI {
  search(currency: components["schemas"]["Currency"]): Promise<Result<PaymentMethodI[], InfrastructureError>>;
  findOne(currency: components["schemas"]["Currency"], identifier: PaymentMethodIdentifier): Promise<Result<PaymentMethodI, ErrorPaymentMethodNotFound | InfrastructureError>>;
  findLimits(currency: components["schemas"]["Currency"], paymentMethodId: number): Promise<Result<{
    deposit: { min: number | null; max: number | null; cooldownSeconds: number | null }; withdrawal: { min: number | null; max: number | null; cooldownSeconds: number | null };
  }, InfrastructureError>>;
}
