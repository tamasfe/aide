import { type PaymentType, Payment } from "../domain/Payment";
import type { PaymentRepositoryI } from "../domain/PaymentRepository";
import type { WalletCurrency } from "../domain/WalletCurrency";
import { ErrorPendingPaymentFlow } from "../domain/ErrorPendingPaymentFlow";
import { ErrorInsufficientFunds } from "../domain/ErrorInsufficientFunds";
import { ErrorWalletHasInsufficientWagers } from "../domain/ErrorWalletHasInsufficientWagers";
import { ErrorWalletPaymentCooldownNotFinished } from "../domain/ErrorWalletPaymentCooldownNotFinished";
import { ErrorPaymentAmountExceedsTimeframeLimits } from "../domain/ErrorPaymentAmountExceedsTimeframeLimits";
import { ErrorPaymentAmountOutsideLimits } from "../domain/ErrorPaymentAmountOutsideLimits";
import { ErrorPaymentMethodNotAllowed } from "../domain/ErrorPaymentMethodNotAllowed";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export class PaymentRepositoryGirobet implements PaymentRepositoryI {
  constructor(clientOptions: { baseUrl: string }, commonDependencies: CommonDependenciesI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, commonDependencies);
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

  public async createDepositFlow(amount: number, currency: WalletCurrency, paymentMethodId: number) {
    try {
      const { data, error, response } = await this.apiClient.POST("/payment/deposit", {
        body: {
          amount,
          currency,
          payment_method_id: paymentMethodId,
        },
      });

      if (data) {
        return success({
          flowId: data.flow_id,
          pix: {
            code: data.pix.code,
          },
        });
      }

      if (error) {
        if (error.code === "WALLET_PENDING_FLOW") {
          return fail(new ErrorPendingPaymentFlow("deposit"));
        }
        if (error.code === "PAYMENT_AMOUNT_EXCEEDS_TIMEFRAME_LIMITS") {
          return fail(ErrorPaymentAmountExceedsTimeframeLimits.new(error.metadata.days, Number(error.metadata.limit), { ...error.metadata, amount, currency, paymentMethodId }));
        }
        if (error.code === "PAYMENT_METHOD_NOT_ALLOWED") {
          return fail(ErrorPaymentMethodNotAllowed.new(paymentMethodId, { amount, currency }));
        }
        if (error.code === "PAYMENT_AMOUNT_OUTSIDE_LIMITS") {
          return fail(ErrorPaymentAmountOutsideLimits.new(
            error.metadata.bound,
            typeof error.metadata.max === "string" ? Number(error.metadata.max) : Number(error.metadata.min),
            { ...error.metadata, amount, currency, paymentMethodId },
          ));
        }
        return fail(
          InfrastructureError.newFromError({
            amount, currency, paymentMethodId,
          }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({
          amount, currency, paymentMethodId,
        }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({
          amount, currency, paymentMethodId,
        }, error),
      );
    }
  }

  public async createWithdrawalFlow(amount: number, currency: WalletCurrency, paymentMethodId: number) {
    try {
      const { data, error, response } = await this.apiClient.POST("/payment/withdraw", {
        body: {
          amount,
          currency,
          payment_method_id: paymentMethodId,
        },
      });

      if (data) {
        return success({
          flowId: data.flow_id,
        });
      }

      if (error) {
        if (error.code === "WALLET_PENDING_FLOW") {
          return fail(new ErrorPendingPaymentFlow("deposit"));
        }
        if (error.code === "WALLET_INSUFFICIENT_WAGERS") {
          return fail(ErrorWalletHasInsufficientWagers.new({ amount, currency, paymentMethodId }));
        }
        if (error.code === "WALLET_INSUFFICIENT_FUNDS") {
          return fail(ErrorInsufficientFunds.new({ amount, currency, paymentMethodId }));
        }
        if (error.code === "PAYMENT_AMOUNT_EXCEEDS_TIMEFRAME_LIMITS") {
          return fail(ErrorPaymentAmountExceedsTimeframeLimits.new(error.metadata.days, Number(error.metadata.limit), { ...error.metadata, amount, currency, paymentMethodId }));
        }
        if (error.code === "WALLET_PAYMENT_COOLDOWN") {
          return fail(ErrorWalletPaymentCooldownNotFinished.new(error.metadata.minutes_left, { amount, currency, paymentMethodId }));
        }
        if (error.code === "PAYMENT_METHOD_NOT_ALLOWED") {
          return fail(ErrorPaymentMethodNotAllowed.new(paymentMethodId, { amount, currency }));
        }
        if (error.code === "PAYMENT_AMOUNT_OUTSIDE_LIMITS") {
          return fail(ErrorPaymentAmountOutsideLimits.new(error.metadata.bound,
            typeof error.metadata.max === "string" ? Number(error.metadata.max) : Number(error.metadata.min),
            { ...error.metadata, amount, currency, paymentMethodId },
          ));
        }
        return fail(
          InfrastructureError.newFromError({
            amount, currency, paymentMethodId,
          }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({
          amount, currency, paymentMethodId,
        }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({
          amount, currency, paymentMethodId,
        }, error),
      );
    }
  }

  public async findPaymentLimits(currency: WalletCurrency, paymentMethodId: number): Promise<Result<{ deposit: { min: number | null; max: number | null }; withdrawal: { min: number | null; max: number | null } }, InfrastructureError>> {
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
