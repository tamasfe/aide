import type { ClickTrackingRepositoryI } from "../domain/ClickTrackingRepository";
import { success, type EmptyResult } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export class ClicksTrackingRepoDumb implements ClickTrackingRepositoryI {
  public async store(
    _params: {
      userId: number | null;
      fingerprintValue: string;
      path: string;
    },
    _queryParams: URLSearchParams,
  ): Promise<EmptyResult<InfrastructureError>> {
    return success();
  }

  public async update(
    _params: {
      userId: number;
      fingerprintValue: string;
    },
  ): Promise<EmptyResult<InfrastructureError>> {
    return success();
  }
}
