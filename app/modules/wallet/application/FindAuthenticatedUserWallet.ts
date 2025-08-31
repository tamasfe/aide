import type { WalletRepositoryI } from "../domain/WalletRepository";
import { success } from "~/packages/result";

export class FindAuthenticatedUserWallet {
  constructor(private walletRepository: WalletRepositoryI) {}

  async handle() {
    const walletsResult = await this.walletRepository.findAuthenticated();
    if (walletsResult.isFailure) {
      return walletsResult;
    }

    const selectedWallet = walletsResult.value[0];

    if (!selectedWallet) {
      return success(null);
    }

    return success(selectedWallet);
  }
}
