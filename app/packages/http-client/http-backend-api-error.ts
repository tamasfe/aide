import { CustomError } from "../result";
import type { components } from "./girobet-backend-generated-http-client/openapi-typescript";

type JurisdictionError = components["schemas"]["JurisdictionEnforcerErrorResponse"];

export class HttpBackendApiError extends CustomError {
  public static newFromBackendError(backendError: { code: string; metadata?: Record<string, unknown> | string | undefined }, response: Response) {
    return new HttpBackendApiError(backendError.code, backendError.metadata, response);
  }

  public static isJurisdictionError(payload: unknown): payload is JurisdictionError {
    if (typeof payload === "object" && payload !== null && "code" in payload && typeof payload["code"] === "string") {
      const code = payload["code"];
      if (code === "HOST_NOT_SUPPORTED") {
        return true;
      }
      if (code === "JURISDICTION_NOT_SUPPORTED_NO_ALTERNATIVE_SITE" && "metadata" in payload && typeof payload["metadata"] === "object" && payload["metadata"] !== null && "jurisdiction" in payload["metadata"] && typeof payload["metadata"]["jurisdiction"] === "string") {
        return true;
      }
      if (code === "JURISDICTION_NOT_SUPPORTED_ALTERNATIVE_SITE" && "metadata" in payload && typeof payload["metadata"] === "object" && payload["metadata"] !== null && "jurisdiction" in payload["metadata"] && typeof payload["metadata"]["jurisdiction"] === "string" && "alternative_site" in payload["metadata"] && typeof payload["metadata"]["alternative_site"] === "object" && payload["metadata"]["alternative_site"] !== null && "domain" in payload["metadata"]["alternative_site"] && typeof payload["metadata"]["alternative_site"]["domain"] === "object" && payload["metadata"]["alternative_site"]["domain"] !== null && "frontend" in payload["metadata"]["alternative_site"]["domain"] && (typeof payload["metadata"]["alternative_site"]["domain"]["frontend"] === "string" || payload["metadata"]["alternative_site"]["domain"]["frontend"] === null)) {
        return true;
      }
      if (code === "USER_ACCOUNT_JURISDICTION_MISMATCH" && "metadata" in payload && typeof payload["metadata"] === "object" && payload["metadata"] !== null && "jurisdiction" in payload["metadata"] && typeof payload["metadata"]["jurisdiction"] === "string") {
        return true;
      }
      if (code === "JURISDICTION_SUPPORTED_BUT_NOT_ENABLED" && "metadata" in payload && typeof payload["metadata"] === "object" && payload["metadata"] !== null && "jurisdiction" in payload["metadata"] && typeof payload["metadata"]["jurisdiction"] === "string") {
        return true;
      }
    }
    return false;
  };

  public get isJurisdictionNotSupportedError(): boolean {
    return this.code === "JURISDICTION_NOT_SUPPORTED_NO_ALTERNATIVE_SITE"
      || this.code === "JURISDICTION_NOT_SUPPORTED_ALTERNATIVE_SITE"
      || this.code === "USER_ACCOUNT_JURISDICTION_MISMATCH"
      || this.code === "JURISDICTION_SUPPORTED_BUT_NOT_ENABLED";
  }

  public status: number;

  override name = "HttpBackendApiError" as const;

  constructor(public readonly code: string, errorMetadata: Record<string, unknown> | string | undefined, response: Response) {
    super(`Backend API returned error code "${code}"`, {
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
