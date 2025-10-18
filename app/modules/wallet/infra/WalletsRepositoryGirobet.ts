import type { WalletRepositoryI } from "../domain/WalletRepository";
import type { ErrorCurrencyNotRecognized } from "../domain/ErrorCurrencyNotRecognized";
import type { ErrorInvalidBalance } from "../domain/ErrorInvalidBalance";
import { ErrorUserNotAuthorized } from "../domain/ErrorUserNotAuthorized";
import { fail, success, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { HttpBackendApiError } from "~/packages/http-client/http-backend-api-error";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import type { ApiClient } from "../../../plugins/api-client";

export class WalletsRepositoryGirobet implements WalletRepositoryI {
  constructor(private readonly apiClient: ApiClient) {}

  public async findAuthenticated(): Promise<Result<CamelizeKeys<components["schemas"]["UserWalletBalanceResponse"][]>, InfrastructureError | ErrorCurrencyNotRecognized | ErrorInvalidBalance | ErrorUserNotAuthorized>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/user/balance", {});

      if (data) {
        return success(data.map(wallet => camelizeKeys(wallet)));
      }

      if (error) {
        if (error.code === "UNAUTHORIZED") {
          return fail(
            new ErrorUserNotAuthorized({}),
          );
        }

        return fail(
          InfrastructureError.newFromError({}, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        InfrastructureError.newFromUnknownError({}, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError({}, error),
      );
    }
  }
}
