import type { AuthenticatedUserRepositoryI } from "../domain/AuthenticatedUserRepository";
import { User } from "../domain/User";
import { ErrorInvalidCurrentPassword } from "../domain/errors/ErrorInvalidCurrentPassword";
import type { UserSettingsI } from "../domain/UserSettings";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { fail, success, type EmptyResult, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import type { SupportedLocale } from "~/packages/translation";
import { searchSimilarLocale } from "~/packages/translation/utils";

export class AuthenticatedUserSearcherGirobet implements AuthenticatedUserRepositoryI {
  constructor(clientOptions: { baseUrl: string; userJurisdiction: string | undefined; headers?: Record<string, string> }, asyncMessagePublisher: AsyncMessagePublisherI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, asyncMessagePublisher);
  }

  public async searchProfile(): Promise<Result<User | null, InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/user/profile");

      if (error) {
        if (error.code === "UNAUTHORIZED") {
          return success(null);
        }

        const httpError = HttpBackendApiError.newFromBackendError(error, response);
        return fail(InfrastructureError.newFromError({}, httpError));
      }

      if (data) {
        return success(User.newFromProps({
          id: data.id,
          locale: searchSimilarLocale(data.locale),
          timeZone: data.time_zone,
          jurisdiction: data.jurisdiction,
          email: data.email,
          telephone: `+${data.phone.code.value}${data.phone.national.value}`,
        }));
      }

      return fail(InfrastructureError.newFromError({ data, error, response }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")));
    }
    catch (error) {
      return fail(InfrastructureError.newFromUnknownError({}, error));
    }
  }

  public async searchSettings(): Promise<Result<null | UserSettingsI, InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.GET("/user/settings");

      if (error) {
        if (error.code === "UNAUTHORIZED") {
          return success(null);
        }

        const httpError = HttpBackendApiError.newFromBackendError(error, response);
        return fail(InfrastructureError.newFromError({}, httpError));
      }

      if (data) {
        return success({
          timeZone: data.time_zone ?? null,
          locale: data.locale ? searchSimilarLocale(data.locale) : null,
          consents: {
            email: data.consents.email ?? null,
            postMail: data.consents.post_mail ?? null,
            pushNotification: data.consents.push_notification ?? null,
            siteNotification: data.consents.site_notification ?? null,
            sms: data.consents.sms ?? null,
            telephone: data.consents.telephone ?? null,
          },
          payment: {
            pixKeyEmail: data.payment.pix_key_email ?? null,
            pixKeyEvp: data.payment.pix_key_evp ?? null,
            pixKeyPhone: data.payment.pix_key_phone ?? null,
            pixKeyType: data.payment.pix_key_type ?? null,
          },
        });
      }

      return fail(InfrastructureError.newFromError({ data, error, response }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")));
    }
    catch (error) {
      return fail(InfrastructureError.newFromUnknownError({}, error));
    }
  }

  public async updateSettings(settings: {
    locale?: SupportedLocale;
    timeZone?: string;
    consents?: {
      email?: boolean;
      postMail?: boolean;
      pushNotification?: boolean;
      siteNotification?: boolean;
      sms?: boolean;
      telephone?: boolean;
    };
  }): Promise<EmptyResult<InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.PATCH("/user/settings", {
        body: {
          locale: settings.locale,
          consents: settings.consents
            ? {
                email: settings.consents.email,
                post_mail: settings.consents.postMail,
                push_notification: settings.consents.pushNotification,
                site_notification: settings.consents.siteNotification,
                sms: settings.consents.sms,
                telephone: settings.consents.telephone,
              }
            : {},
          time_zone: settings.timeZone,
          payment: {},
        },
      });

      if (data || response.ok) {
        return success();
      }

      if (error) {
        const httpError = HttpBackendApiError.newFromBackendError(error, response);
        return fail(InfrastructureError.newFromError({ settings }, httpError));
      }

      return fail(InfrastructureError.newFromError({ data, error, response, settings }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")));
    }
    catch (error) {
      return fail(InfrastructureError.newFromUnknownError({ settings }, error));
    }
  }

  public async updatePassword(currentPassword: string, newPassword: string): Promise<EmptyResult<ErrorInvalidCurrentPassword | InfrastructureError>> {
    try {
      const { data, error, response } = await this.apiClient.PATCH("/user/password", {
        body: {
          current_password: currentPassword,
          new_password: newPassword,
        },
      });

      if (data || response.ok) {
        return success();
      }

      if (error) {
        if (error.code === "UNAUTHORIZED") {
          return fail(new ErrorInvalidCurrentPassword());
        }
        const httpError = HttpBackendApiError.newFromBackendError(error, response);
        return fail(InfrastructureError.newFromError({}, httpError));
      }

      return fail(InfrastructureError.newFromError({ data, error, response }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")));
    }
    catch (error) {
      return fail(InfrastructureError.newFromUnknownError({}, error));
    }
  }

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
