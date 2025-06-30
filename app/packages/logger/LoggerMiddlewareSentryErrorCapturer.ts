import type { captureException } from "@sentry/nuxt";
import type { CustomError } from "../result";
import { HttpBackendApiError } from "../http-client/http-backend-api-error";
import { InfrastructureError } from "../result/infrastructure-error";
import type { LoggerMiddleware, LogLevel } from "./Logger";

export class LoggerMiddlewareSentryErrorCapturer implements LoggerMiddleware {
  public levels: LogLevel[] = ["error"];

  public callback(_level: LogLevel, _message: string, _error: CustomError | undefined, _data: Record<string, unknown>): ((level: LogLevel, message: string, error: CustomError | undefined, data: Record<string, unknown>) => void) {
    return (level: LogLevel, message: string, error: CustomError | undefined, data: Record<string, unknown>) => {
      if (level === "error" && error) {
        if (error instanceof InfrastructureError) {
          if (error.cause instanceof HttpBackendApiError && error.cause.isJurisdictionNotSupportedError) {
            return;
          }
          // Capture the cause of the InfrastructureError instead of the InfrastructureError itself
          this.sentryCaptureException(error.cause, (scope) => {
            scope.setContext("Log", { data, message });
            scope.setContext("Error metadata", { ...("metadata" in error.cause ? error.cause.metadata : error.cause) });
            scope.setContext("Parent InfrastructureError metadata", error.toJSON());
            return scope;
          });
          return;
        }
        this.sentryCaptureException(error, (scope) => {
          scope.setContext("Log", { data, message });
          scope.setContext("Error metadata", error.toJSON());
          return scope;
        });
      }
    };
  }

  constructor(private sentryCaptureException: typeof captureException) {}
}
