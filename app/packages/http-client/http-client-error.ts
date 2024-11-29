import { CustomError } from "../result";
import type { components } from "./girobet-backend-generated-http-client/openapi-typescript";

type ServerErrorCode = components["schemas"]["ServerError"]["code"];
export class HttpBackendApiError extends CustomError {
  public static newFromBackendError(backendError: { code: ServerErrorCode; metadata?: Record<string, unknown> | string | undefined }, response: Response) {
    return new HttpBackendApiError(backendError.code, backendError.metadata, response);
  }

  public static isBackendServerError(payload: unknown): payload is components["schemas"]["ServerError"] {
    return typeof payload === "object" && payload !== null && "code" in payload && typeof payload["code"] === "string";
  };

  public get isJurisdictionNotSupportedError(): boolean {
    return this.code === "JURISDICTION_NOT_SUPPORTED_NO_ALTERNATIVE_SITE"
      || this.code === "JURISDICTION_NOT_SUPPORTED_ALTERNATIVE_SITE"
      || this.code === "USER_ACCOUNT_JURISDICTION_MISMATCH"
      || this.code === "JURISDICTION_SUPPORTED_BUT_NOT_ENABLED";
  }

  public status: number;

  override name = "HttpBackendApiError" as const;

  constructor(public readonly code: ServerErrorCode, errorMetadata: Record<string, unknown> | string | undefined, response: Response) {
    super(`Backend API returned an error`, {
      code,
      metadataFromBackend: errorMetadata,
      response: {
        url: response.url,
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
      },
    });

    this.status = response.status;
  }
}
