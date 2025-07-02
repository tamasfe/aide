import type { NotificationBackendRepositoryI } from "../domain/NotificationBackendRepository";
import type { NotificationBackend } from "../domain/NotificationBackend";
import { ErrorRetrievingNotifications } from "../domain/ErrorRetrievingNotifications";
import type { ErrorNotificationNotFound } from "../domain/ErrorNotificationNotFound";
import { ErrorSavingNotification } from "../domain/ErrorSavingNotification";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-backend-api-error";
import { fail, success, type EmptyResult, type Result } from "~/packages/result";
import type { CommonDependenciesI } from "~/dependency-injection/load-di";

export class NotificationBackendRepositoryGirobet implements NotificationBackendRepositoryI {
  constructor(clientOptions: { baseUrl: string }, commonDependencies: CommonDependenciesI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, commonDependencies);
  }

  public async searchPaginating(searchParams: {
    readStatus?: "read" | "unread" | null;
    types?: NotificationBackend["type"][] | null;
  },
  limit: number, offset: number,
  ): Promise<Result<
      {
        notifications: NotificationBackend[];
        pagination: {
          limit: number;
          offset: number;
          totalItems: number;
        };
      },
      ErrorRetrievingNotifications
    >> {
    try {
      const { data, error, response } = await this.apiClient.GET("/notification/list", {
        params: {
          query: {
            read_status: searchParams.readStatus || null,
            types: searchParams.types || null,
            limit,
            offset,
          },
        },
      });

      if (data) {
        return success({
          notifications: data.data.map(notificationData => camelizeKeys(notificationData)),
          pagination: {
            limit: data.metadata.pagination.limit,
            offset: data.metadata.pagination.offset,
            totalItems: data.metadata.pagination.total_items ?? NaN,
          },
        });
      }

      if (error) {
        return fail(
          ErrorRetrievingNotifications.newFromError({
            searchParams, limit, offset,
          }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        ErrorRetrievingNotifications.newFromUnknownError({
          searchParams, limit, offset,
        }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        ErrorRetrievingNotifications.newFromUnknownError({
          searchParams, limit, offset,
        }, error),
      );
    }
  }

  public async updateReadStatus(notificationId: number, status: "read" | "unread"): Promise<EmptyResult<ErrorNotificationNotFound | ErrorSavingNotification>> {
    try {
      const { data, error, response } = await this.apiClient.PATCH("/notification/{notification_id}/read-status", {
        params: {
          path: {
            notification_id: notificationId,
          },
        },
        body: status,
      });

      if (data || response.ok) {
        return success();
      }

      if (error) {
        return fail(
          ErrorSavingNotification.newFromError({ notificationId }, HttpBackendApiError.newFromBackendError(error, response)),
        );
      }

      return fail(
        ErrorSavingNotification.newFromUnknownError({ notificationId }, new Error("Unexpected scenario: library did not return data nor error. This should never happen")),
      );
    }
    catch (error: unknown) {
      return fail(
        ErrorSavingNotification.newFromUnknownError({ notificationId }, error),
      );
    }
  }

  private readonly apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
