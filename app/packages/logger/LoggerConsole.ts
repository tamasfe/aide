import type { LoggerI } from "./Logger";

export class LoggerConsole implements LoggerI {
  public debug(message: string, data: Record<string, unknown> = {}): void {
    console.debug(message, { runtime: this.findRuntime(), ...data });
  }

  public info(message: string, data: Record<string, unknown> = {}): void {
    console.info(message, { runtime: this.findRuntime(), ...data });
  }

  public warn(message: string, data: Record<string, unknown> = {}): void {
    console.warn(message, { runtime: this.findRuntime(), ...data });
  }

  public error(message: string, data: Record<string, unknown> = {}): void {
    console.error(message, { runtime: this.findRuntime(), ...data });
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
