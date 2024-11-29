import { CustomError } from "../result";
import type { components } from "./girobet-backend-generated-http-client/openapi-typescript";

export class HttpBackendApiError extends CustomError {
  public static newFromBackendError(backendError: { code: string; metadata?: Record<string, unknown> | string | undefined }, response: Response) {
    return new HttpBackendApiError(backendError.code, backendError.metadata, response);
  }

  public static isBackendServerError(payload: unknown): payload is components["schemas"]["ServerError"] {
    return typeof payload === "object" && payload !== null && "code" in payload && typeof payload["code"] === "string";
  };

  public status: number;

  override name = "HttpBackendApiError" as const;

  constructor(code: string, errorMetadata: Record<string, unknown> | string | undefined, response: Response) {
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
