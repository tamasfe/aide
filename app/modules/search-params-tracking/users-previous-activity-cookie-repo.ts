import type { useCookie as useCookieType } from "#app";
import { fail, success, type EmptyResult, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";

export class UsersPreviousActivityCookieRepo {
  constructor(
    private readonly isServer: boolean,
    private readonly useCookie: typeof useCookieType, // We see some "[nuxt] instance unavailable" errors in production, so we pass useCookie as a parameter to have a cleaner composable usage and fix the errors.
  ) {}

  public static COOKIE_NAME = "prev_reco";

  public hasPreviouslyLoggedIn(): Result<boolean, InfrastructureError> {
    try {
      const cookie = this.useCookie(UsersPreviousActivityCookieRepo.COOKIE_NAME);

      if (!cookie.value) {
        return success(false);
      }
      return success(true);
    }
    catch (error: unknown) {
      return fail(
        new InfrastructureError(
          "Error checking if cookie exists",
          { COOKIE_NAME: UsersPreviousActivityCookieRepo.COOKIE_NAME },
          InfrastructureError.parseCause(error),
        ),
      );
    }
  }

  public async set(value: string): Promise<EmptyResult<InfrastructureError>> {
    try {
      const cookie = this.useCookie(UsersPreviousActivityCookieRepo.COOKIE_NAME, { httpOnly: false, sameSite: "strict", maxAge: 60 * 60 * 24 * 365 }); // 1 year
      cookie.value = value;
      return success();
    }
    catch (error: unknown) {
      return fail(
        new InfrastructureError(
          "Error setting cookie value",
          { COOKIE_NAME: UsersPreviousActivityCookieRepo.COOKIE_NAME },
          InfrastructureError.parseCause(error),
        ),
      );
    }
  }
}
