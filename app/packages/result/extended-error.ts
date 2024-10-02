import { CustomError } from "./custom-error";

export class ExtendedError extends CustomError {
  public name = "ExtendedError";

  constructor(
    message: string,
    metadata: Record<string, unknown>,
    public override readonly cause: Error | ExtendedError,
  ) {
    super(message, metadata);
  }

  public static fromUnknown(
    message: string,
    metadata: Record<string, unknown>,
    unknownError: unknown,
  ) {
    if (unknownError instanceof Error) {
      return new ExtendedError(
        message,
        {
          ...metadata,
          stringifiedError: JSON.stringify(unknownError),
        },
        unknownError,
      );
    }

    if (
      typeof unknownError === "object"
      && unknownError !== null
      && "message" in unknownError
      && typeof (unknownError as Record<string, unknown>).message === "string"
      && "stack" in unknownError
      && typeof (unknownError as Record<string, unknown>).stack === "string"
      && "name" in unknownError
      && typeof (unknownError as Record<string, unknown>).name === "string"
    ) {
      return new ExtendedError(
        message,
        {
          ...metadata,
          stringifiedError: JSON.stringify(unknownError),
        },
        unknownError as Error,
      );
    }

    const error = new Error(
      "Unknown infrastructure error, check rawError metadata",
    );
    if (typeof unknownError === "object" && unknownError !== null) {
      return new ExtendedError(
        message,
        {
          ...metadata,
          rawError: unknownError,
          stringifiedError: JSON.stringify(unknownError),
        },
        Object.assign(error, unknownError),
      );
    }

    return new ExtendedError(
      message,
      {
        ...metadata,
        rawError: unknownError,
        stringifiedError: JSON.stringify(unknownError),
      },
      error,
    );
  }
}

export abstract class AbstractExtendedError extends CustomError {
  constructor(
    message: string,
    metadata: Record<string, unknown>,
    public override readonly cause: Error | ExtendedError,
  ) {
    super(message, { ...metadata, rawError: JSON.stringify(cause) });
  }

  public override toJSON() {
    return {
      ...super.toJSON(),
      type: this.name,
      cause:
        this.cause instanceof ExtendedError || this.cause instanceof CustomError
          ? this.cause.toJSON()
          : {
              type: this.cause.name,
              name: this.cause.name,
              message: this.cause.message,
              stack: this.cause.stack,
            },
    };
  }

  public static parseCause(unknownError: unknown): Error {
    if (unknownError instanceof Error) {
      return unknownError;
    }

    if (
      typeof unknownError === "object"
      && unknownError !== null
      && "message" in unknownError
      && typeof (unknownError as Record<string, unknown>).message === "string"
      && "stack" in unknownError
      && typeof (unknownError as Record<string, unknown>).stack === "string"
      && "name" in unknownError
      && typeof (unknownError as Record<string, unknown>).name === "string"
    ) {
      return unknownError as Error;
    }

    const error = new Error(
      "Unknown cause error, check rawError metadata for more details",
    );
    if (typeof unknownError === "object" && unknownError !== null) {
      return Object.assign(error, unknownError);
    }

    return error;
  }
}
