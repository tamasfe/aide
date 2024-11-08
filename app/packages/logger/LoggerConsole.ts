import type { CustomError } from "../result";
import type { LoggerI, LoggerMiddleware, LogLevel } from "./Logger";

export class LoggerConsole implements LoggerI {
  public debug(message: string, data: Record<string, unknown> = {}): void {
    if (!this.levelIsAllowed("debug")) {
      return;
    }

    if (this.format === "json") {
      console.debug(this.toStringifiedJSON("debug", message, data));
      return;
    }
    console.debug(message, this.metadataMerging(data));
  }

  public info(message: string, data: Record<string, unknown> = {}): void {
    if (!this.levelIsAllowed("info")) {
      return;
    }

    if (this.format === "json") {
      console.info(this.toStringifiedJSON("info", message, data));
      return;
    }
    console.info(message, this.metadataMerging(data));
  }

  public warn(message: string, data: Record<string, unknown> = {}): void {
    if (!this.levelIsAllowed("warn")) {
      return;
    }

    if (this.format === "json") {
      console.warn(this.toStringifiedJSON("warn", message, data));
      return;
    }
    console.warn(message, this.metadataMerging(data));
  }

  public error(message: string, error: CustomError, data: Record<string, unknown> = {}): void {
    if (!this.levelIsAllowed("error")) {
      return;
    }

    const dataWithError = {
      ...data,
      error,
    };

    this.runMiddlewaresAroundCallback("error", message, error, dataWithError, () => {
      if (this.format === "json") {
        console.error(this.toStringifiedJSON("error", message, dataWithError));
        return;
      }
      console.error(message, this.metadataMerging(dataWithError));
    });
  }

  constructor(
    private format: "json" | "prettyPrint",
    private level: LogLevel,
    private serviceInfo: {
      name: string;
      release: string;
    },
    private middlewares: LoggerMiddleware[] = [],
  ) {}

  private toStringifiedJSON(level: LogLevel, message: string, data: Record<string, unknown> = {}) {
    return JSON.stringify({ message, level, ...this.metadataMerging(data) });
  }

  private metadataMerging(data: Record<string, unknown>) {
    return { timestamp: new Date().toISOString(), service: this.serviceInfo.name, release: this.serviceInfo.release, runtime: this.findRuntime(), ...data };
  }

  private levelIsAllowed(level: LogLevel) {
    if (this.level === "debug") {
      return true;
    }
    if (this.level === "info" && level !== "debug") {
      return true;
    }
    if (this.level === "warn" && level !== "debug" && level !== "info") {
      return true;
    }
    if (this.level === "error" && level === "error") {
      return true;
    }

    return false;
  }

  private findRuntime(): "client" | "server" | "unknown" {
    if (import.meta.client) {
      return "client";
    }
    if (import.meta.server) {
      return "server";
    }
    return "unknown";
  }

  private runMiddlewaresAroundCallback(level: LogLevel, message: string, error: CustomError | undefined, data: Record<string, unknown>, callback: () => void) {
    const endMiddlewareCallbacks: ReturnType<LoggerMiddleware["callback"]>[] = [];
    for (const middleware of this.middlewares) {
      if (middleware.levels.includes(level)) {
        endMiddlewareCallbacks.push(middleware.callback(level, message, error, data));
      }
    }

    callback();

    for (const middlewareEndCallbacks of endMiddlewareCallbacks) {
      middlewareEndCallbacks("error", message, error, data);
    }
  }
}
