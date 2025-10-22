import type { ErrorCurrencyNotRecognized } from "./ErrorCurrencyNotRecognized";
import type { ErrorInvalidBalance } from "./ErrorInvalidBalance";
import type { ErrorUserNotAuthorized } from "./ErrorUserNotAuthorized";
import type { Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";

export interface WalletRepositoryI {
  findAuthenticated(): Promise<Result<components["schemas"]["UserWalletBalanceResponse"][], InfrastructureError | ErrorCurrencyNotRecognized | ErrorInvalidBalance | ErrorUserNotAuthorized>>;
  getAvailableCurrencies(): Promise<Result<components["schemas"]["Currency"][], InfrastructureError | ErrorUserNotAuthorized>>;
}
