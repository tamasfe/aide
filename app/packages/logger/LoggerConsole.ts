import type { LoggerI } from "./Logger";

type LogLevel = "debug" | "info" | "warn" | "error";

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

  public error(message: string, data: Record<string, unknown> = {}): void {
    if (!this.levelIsAllowed("error")) {
      return;
    }

    if (this.format === "json") {
      console.error(this.toStringifiedJSON("error", message, data));
      return;
    }
    console.error(message, this.metadataMerging(data));
  }

  constructor(
    private serviceName: string,
    private format: "json" | "prettyPrint",
    private level: LogLevel,
  ) {}

  private toStringifiedJSON(level: LogLevel, message: string, data: Record<string, unknown> = {}) {
    return JSON.stringify({ message, level, ...this.metadataMerging(data) });
  }

  private metadataMerging(data: Record<string, unknown>) {
    return { timestamp: new Date().toISOString(), service: this.serviceName, runtime: this.findRuntime(), ...data };
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
}
