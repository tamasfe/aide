import { CustomError } from "~/packages/result";

export class ErrorTranslatedContentNotFound extends CustomError {
  override name = "ErrorTranslatedContentNotFound" as const;

  constructor(locale: string, contentPath: string) {
    super(`Translated content not found for this locale & path`, { locale, contentPath });
  }
}
