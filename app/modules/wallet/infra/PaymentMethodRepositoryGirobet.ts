import type { WalletCurrency } from "../domain/WalletCurrency";
import type { PaymentMethodRepositoryI } from "../domain/PaymentMethodRepository";
import type { PaymentMethodI, PaymentMethodIdentifier } from "../domain/PaymentMethod";
import { ErrorPaymentMethodNotFound } from "../domain/ErrorPaymentMethodNotFound";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";

export class PaymentMethodRepositoryGirobet implements PaymentMethodRepositoryI {
  constructor(clientOptions: { baseUrl: string; headers?: Record<string, string>; userJurisdiction?: string }, asyncMessagePublisher: AsyncMessagePublisherI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, asyncMessagePublisher);
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

  public async findLimits(currency: WalletCurrency, paymentMethodId: number): Promise<Result<{ deposit: { min: number | null; max: number | null }; withdrawal: { min: number | null; max: number | null } }, InfrastructureError>> {
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
            min: data.deposit_min ?? null,
            max: data.deposit_max ?? null,
          },
          withdrawal: {
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
