import type { PromoUserActionActivityLocalStorage } from "../PromoUserActionActivityLocalStorage";
import type { EmitCommandOpenUserActionModalModal } from "./EmitCommandOpenUserActionModal";
import type { LoggerI } from "~/packages/logger/Logger";

export class OpenUserPromoActionModalOncePerDay {
  constructor(
    private readonly promoUserActionActivityLocalStorage: PromoUserActionActivityLocalStorage,
    private readonly emitCommandOpenUserActionModal: EmitCommandOpenUserActionModalModal,
    private readonly logger: LoggerI,
  ) {}

  public async handle(currentDate: Date = new Date()): Promise<void> {
    if (typeof window === "undefined") {
      return;
    }

    const lastResult = this.promoUserActionActivityLocalStorage.getLast();
    if (lastResult.isFailure) {
      this.logger.error("Failed to retrieve last promo user action activity", lastResult.error, {
        currentDate: currentDate.toISOString(),
      });
      return;
    }

    if (lastResult.value && this.isSameDay(lastResult.value.showedAt, currentDate)) {
      return;
    }

    await this.emitCommandOpenUserActionModal.handle({ modal: "promo_user_action" });

    const saveResult = this.promoUserActionActivityLocalStorage.save(currentDate);
    if (saveResult.isFailure) {
      this.logger.error("Failed to persist promo user action activity", saveResult.error, {
        currentDate: currentDate.toISOString(),
      });
    }
  }

  private isSameDay(first: Date, second: Date): boolean {
    return Math.abs(first.getTime() - second.getTime()) < 24 * 60 * 60 * 1000;
  }
}
