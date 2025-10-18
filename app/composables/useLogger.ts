import type { LoggerConsole } from "~/packages/logger/LoggerConsole";

export default function (): LoggerConsole {
  const nuxtApp = useNuxtApp();

  return nuxtApp.$logger;
}
