import { CustomError } from "~/packages/result";

export class ErrorUnsupportedLocale extends CustomError {
  override readonly name = "ErrorUnsupportedLocale" as const;

  constructor(invalidLocale: string) {
    super("This locale is not yet supported", { invalidLocale });
  }
}
