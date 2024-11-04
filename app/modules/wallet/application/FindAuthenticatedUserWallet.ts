import type { WalletRepositoryI } from "../domain/WalletRepository";
import { newEmptyWallet } from "../domain/Wallet";
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
      return success(newEmptyWallet());
    }

    return success(selectedWallet);
  }
}
