import { CustomError } from "~/packages/result";

export class ErrorNoAuthenticatedWalletsFound extends CustomError {
  override name = "ErrorNoAuthenticatedWalletsFound" as const;

  constructor(metadata: Record<string, unknown>) {
    super("No authenticated wallets found", metadata);
  }
}
