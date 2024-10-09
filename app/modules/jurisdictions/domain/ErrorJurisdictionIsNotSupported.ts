import { CustomError } from "~/packages/result";

export class ErrorJurisdictionIsNotSupported extends CustomError {
  override name = "ErrorJurisdictionIsNotSupported" as const;

  public static newNotSupported(jurisdiction: string) {
    return new ErrorJurisdictionIsNotSupported(jurisdiction);
  }

  public static newWithAlternatives(jurisdiction: string, alternativeSites: string[]) {
    return new ErrorJurisdictionIsNotSupported(jurisdiction, alternativeSites);
  }

  public static newNotSupportedForUser(jurisdiction: string) {
    return new ErrorJurisdictionIsNotSupported(jurisdiction, [], true);
  }

  public get recommendedAlternativeSite(): string | null {
    return this.alternativeSites?.[0] || null;
  }

  private constructor(public readonly jurisdiction: string, public readonly alternativeSites: string[] = [], public readonly userJurisdictionDoesNotMatchNetwork = false) {
    super(`Jurisdiction is not supported`, {
      jurisdiction,
      alternativeSites,
      userJurisdictionDoesNotMatchNetwork,
    });
  }
}
