export abstract class CustomError extends Error {
  abstract override readonly name: string;
  public readonly metadata: Record<string, unknown>;

  constructor(message: string, metadata: Record<string, unknown> = {}) {
    super(message);
    this.metadata = metadata;

    // fix the extended error prototype chain (set it as the actual class name of the error)
    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      // This clips the constructor invocation from the stack trace.
      // It's not absolutely essential, but it does make the stack trace a little nicer.
      Error.captureStackTrace(this, this.constructor);
    }

    Object.defineProperty(this, "stack", { enumerable: true });
  }

  public toJSON(): Record<string, unknown> {
    return this.callToJSONOrReturnObject(this as Record<string, unknown>);
  }

  public addMetadata(moreMetadata: Record<string, unknown>): void {
    Object.assign(this.metadata, { ...moreMetadata });
  }

  private callToJSONOrReturnObject(
    someObject: Record<string, unknown>,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    Object.getOwnPropertyNames(someObject).forEach((propertyName) => {
      const propertyValue = someObject[propertyName];
      if (
        typeof propertyValue === "object"
        && propertyValue !== null
        && !Array.isArray(propertyValue)
      ) {
        const retypedPropertyValue = propertyValue as Record<string, unknown>;
        if (
          "toJSON" in retypedPropertyValue
          && typeof retypedPropertyValue.toJSON === "function"
        ) {
          result[propertyName] = retypedPropertyValue.toJSON();
          return;
        }

        result[propertyName]
          = this.callToJSONOrReturnObject(retypedPropertyValue);
        return;
      }

      if (typeof propertyValue === "function") {
        return;
      }

      result[propertyName] = propertyValue;
    });

    return result;
  }
}
