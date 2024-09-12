import { AbstractExtendedError } from "~/packages/result";

export class ErrorRegisteringUser extends AbstractExtendedError {
  public override name = "ErrorRegisteringUser" as const;

  public static newFromUnknown(
    metadata: Record<string, unknown>,
    unknownError: unknown,
  ): ErrorRegisteringUser {
    return new ErrorRegisteringUser(
      {
        ...metadata,
        stringifiedError: JSON.stringify(unknownError),
      },
      super.parseCause(unknownError),
    );
  }

  constructor(metadata: Record<string, unknown>, cause: Error) {
    super("Error registering user. More info in the cause.", metadata, cause);
  }
}
