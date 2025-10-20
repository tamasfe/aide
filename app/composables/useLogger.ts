import type { LoggerConsole } from "~/packages/logger/LoggerConsole";

export default function (): LoggerConsole {
  const { $logger } = useNuxtApp();

  return $logger;
}
