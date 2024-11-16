import { type PaymentType, Payment } from "../domain/Payment";
import type { PaymentRepositoryI } from "../domain/PaymentRepository";
import type { WalletCurrency } from "../domain/WalletCurrency";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";

export class PaymentRepositoryGirobet implements PaymentRepositoryI {
  constructor(clientOptions: { baseUrl: string; headers?: Record<string, string>; userJurisdiction?: string }, asyncMessagePublisher: AsyncMessagePublisherI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, asyncMessagePublisher);
  }

  public async searchPaginating(searchParams: { type: PaymentType | null; walletId: number | null }, limit: number, offset: number): Promise<Result<{ payments: Payment[]; pagination: { limit: number; offset: number; totalItems: number } }, InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/payment/list", {
        params: {
          query: {
            payment_type: searchParams.type,
            wallet_id: searchParams.walletId,
            limit,
            offset,
          },
        },
      });

      if (data) {
        return success({
          payments: data.data.map(paymentData => Payment.new({
            amount: Number(paymentData.amount),
            currency: paymentData.currency as WalletCurrency,
            createdAt: new Date(paymentData.created_at),
            id: paymentData.id,
            type: paymentData.payment_type,
            walletId: paymentData.wallet_id,
            identifier: paymentData.identifier,
            status: paymentData.status || null,
          })),
          pagination: {
            limit: data.metadata.pagination.limit,
            offset: data.metadata.pagination.offset,
            totalItems: data.metadata.pagination.total_items,
          },
        });
      }

      if (error) {
        return fail(
          InfrastructureError.newFromError({
            searchParams, limit, offset,
          }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({
          searchParams, limit, offset,
        }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({
          searchParams, limit, offset,
        }, error),
      );
    }
  }

  private readonly apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
