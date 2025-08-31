import type { components } from "~/packages/http-client/girobet-backend-generated-http-client/openapi-typescript";
import type { CamelizeKeys } from "~/utils";

export type Wallet = CamelizeKeys<components["schemas"]["UserWalletBalanceResponse"]>;

/**
 * Danger!
 * This needs to be changed before we allow multiple currencies, as it assumes a single default currency for all new users.
 * TODO: talk with Daniel into how to "assume" the user's currency before their first deposit. It could be selectable by them, or
 * assigned by us.
 */
export const DEFAULT_CURRENCY_WHILE_USER_HAS_NO_WALLET = "BRL";
