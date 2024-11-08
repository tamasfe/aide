import type { CustomError } from "../result";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LoggerMiddleware {
  levels: LogLevel[];
  callback: (level: LogLevel, message: string, error: CustomError | undefined, data: Record<string, unknown>) => ((level: LogLevel, message: string, error: CustomError | undefined, data: Record<string, unknown>) => void);
}

export interface LoggerI {
  debug(message: string, data?: Record<string, unknown>): void;
  info(message: string, data?: Record<string, unknown>): void;
  warn(message: string, data?: Record<string, unknown>): void;
  error(message: string, error: CustomError, data?: Record<string, unknown>): void;
}
