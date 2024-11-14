import type { captureException } from "@sentry/nuxt";
import type { CustomError } from "../result";
import type { LoggerMiddleware, LogLevel } from "./Logger";

export class LoggerMiddlewareSentryErrorCapturer implements LoggerMiddleware {
  public levels: LogLevel[] = ["error"];

  public callback(_level: LogLevel, _message: string, _error: CustomError | undefined, _data: Record<string, unknown>): ((level: LogLevel, message: string, error: CustomError | undefined, data: Record<string, unknown>) => void) {
    return (level: LogLevel, message: string, error: CustomError | undefined, data: Record<string, unknown>) => {
      if (level === "error" && error) {
        if (error.name === "ErrorJurisdictionIsNotSupported") {
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
