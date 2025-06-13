import type { GamesApiRepositoryI } from "../domain/GamesApiRepository";
import type { GameDevice, Game } from "../domain/Game";
import type { ErrorGameNotFound } from "../domain/ErrorGameNotFound";
import type { ErrorInvalidGameIdentifier } from "../domain/ErrorInvalidGameIdentifier";
import { success, type Result } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface FindGameCompatibilityByIdResponseI extends Game {
  isCompatibleWithDevice: boolean;
}

export class FindGameCompatibilityByIdentifier {
  constructor(private gameRepo: GamesApiRepositoryI) {}

  public async handle(identifier: string, userCurrentDevice: GameDevice): Promise<Result<FindGameCompatibilityByIdResponseI, ErrorGameNotFound | ErrorInvalidGameIdentifier | InfrastructureError>> {
    const gameResult = await this.gameRepo.findByIdentifier(identifier);
    if (gameResult.isFailure) {
      return gameResult;
    }

    const gameIsCompatibleWithDevice = (gameResult.value.devices as GameDevice[]).includes(userCurrentDevice);

    return success({
      ...gameResult.value,
      isCompatibleWithDevice: gameIsCompatibleWithDevice,
    });
  }
}
