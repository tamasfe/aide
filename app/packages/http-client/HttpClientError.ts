import { CustomError } from "../result";

export class HttpBackendApiError extends CustomError {
  public static newFromBackendError(backendError: { code: string; metadata?: Record<string, unknown> | string | undefined }, response: Response) {
    return new HttpBackendApiError(backendError.code, backendError.metadata, response);
  }

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
  }
}
