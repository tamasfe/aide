import type { WalletRepositoryI } from "../domain/WalletRepository";

export class GetAvailableCurrencies {
  constructor(private walletRepository: WalletRepositoryI) {}

  async handle() {
    return this.walletRepository.getAvailableCurrencies();
  }
}
