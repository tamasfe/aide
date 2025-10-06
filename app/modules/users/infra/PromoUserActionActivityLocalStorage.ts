import { fail, success, type EmptyResult, type Result } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";

interface PromoActionActivityItemI {
  showedAt: string;
}

export class PromoUserActionActivityLocalStorage {
  private readonly STORAGE_KEY = "promo-user-action-last-showed-at" as const;

  public save(timestamp: Date): EmptyResult<InfrastructureError> {
    if (!this.isLocalStorageAvailable()) {
      return fail(
        InfrastructureError.newFromError(
          { attemptedTimestamp: timestamp.toISOString() },
          new Error("LocalStorage is not available. This repository is intended for client-side usage only."),
        ),
      );
    }

    try {
      const item: PromoActionActivityItemI = { showedAt: timestamp.toISOString() };
      window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(item));
      return success();
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError(
          { attemptedTimestamp: timestamp.toISOString() },
          error,
        ),
      );
    }
  }

  public getLast(): Result<null | { showedAt: Date }, InfrastructureError> {
    if (!this.isLocalStorageAvailable()) {
      return fail(
        InfrastructureError.newFromError(
          {},
          new Error("LocalStorage is not available. This repository is intended for client-side usage only."),
        ),
      );
    }

    try {
      const storedItem = window.localStorage.getItem(this.STORAGE_KEY);
      if (storedItem === null) {
        return success(null);
      }

      const parsedItem: PromoActionActivityItemI = JSON.parse(storedItem);
      return success({ showedAt: new Date(parsedItem.showedAt) });
    }
    catch (error: unknown) {
      return fail(
        InfrastructureError.newFromUnknownError(
          { storageKey: this.STORAGE_KEY },
          error,
        ),
      );
    }
  }

  private isLocalStorageAvailable(): boolean {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  }
}
