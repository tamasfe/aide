import type { GamesApiRepositoryI } from "../domain/GamesApiRepository";
import type { GameDevice, GameI } from "../domain/Game";
import type { ErrorGameNotFound } from "../domain/ErrorGameNotFound";
import { success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface FindGameCompatibilityByIdResponseI extends GameI {
  isCompatibleWithDevice: boolean;
}

export class FindGameCompatibilityById {
  constructor(private gameRepo: GamesApiRepositoryI) {}

  public async handle(gameId: number, userCurrentDevice: GameDevice): Promise<Result<FindGameCompatibilityByIdResponseI, ErrorGameNotFound | InfrastructureError>> {
    const gameResult = await this.gameRepo.findById(gameId);
    if (gameResult.isFailure) {
      return gameResult;
    }

    const gameIsCompatibleWithDevice = gameResult.value.devices.includes(userCurrentDevice);

    return success({
      ...gameResult.value,
      isCompatibleWithDevice: gameIsCompatibleWithDevice,
    });
  }
}
