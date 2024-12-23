import type { WalletCurrency } from "../domain/WalletCurrency";
import type { PaymentMethodRepositoryI } from "../domain/PaymentMethodRepository";
import type { PaymentMethodI, PaymentMethodIdentifier } from "../domain/PaymentMethod";
import { ErrorPaymentMethodNotFound } from "../domain/ErrorPaymentMethodNotFound";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export class PaymentMethodRepositoryGirobet implements PaymentMethodRepositoryI {
  constructor(clientOptions: { baseUrl: string }, commonDependencies: CommonDependenciesI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, commonDependencies);
  }

  public async search(currency: WalletCurrency): Promise<Result<PaymentMethodI[], InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/payment/methods", {
        params: {
          query: {
            currency,
          },
        },
      });

      if (data) {
        return success(data.map(paymentMethodData => ({ id: paymentMethodData.id, identifier: paymentMethodData.identifier })));
      }

      if (error) {
        return fail(
          InfrastructureError.newFromError({ currency }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromError({ currency }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({ currency }, error),
      );
    }
  }

  public async findOne(currency: WalletCurrency, identifier: PaymentMethodIdentifier): Promise<Result<PaymentMethodI, ErrorPaymentMethodNotFound | InfrastructureError>> {
    const paymentMethodsResult = await this.search(currency);
    if (paymentMethodsResult.isFailure) {
      return paymentMethodsResult;
    }

    const paymentMethod = paymentMethodsResult.value.find(paymentMethod => paymentMethod.identifier === identifier);

    if (!paymentMethod) {
      return fail(ErrorPaymentMethodNotFound.new({ currency, identifier }));
    }
    return success(paymentMethod);
  }

  public async findLimits(currency: WalletCurrency, paymentMethodId: number) {
    try {
      const { data, error, response } = await this.apiClient.GET("/payment/limits", {
        params: {
          query: {
            currency,
            payment_method_id: paymentMethodId,
          },
        },
      });

      if (data) {
        return success({
          deposit: {
            cooldownSeconds: data.deposit_cooldown ?? null,
            min: data.deposit_min ?? null,
            max: data.deposit_max ?? null,
          },
          withdrawal: {
            cooldownSeconds: data.withdrawal_cooldown ?? null,
            min: data.withdrawal_min ?? null,
            max: data.withdrawal_max ?? null,
          },
        });
      }

      if (error) {
        return fail(
          InfrastructureError.newFromError({ currency, paymentMethodId }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromError({ currency, paymentMethodId }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({ currency, paymentMethodId }, error),
      );
    }
  }

  private readonly apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
