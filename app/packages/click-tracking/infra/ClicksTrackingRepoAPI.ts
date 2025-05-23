import type { ClickTrackingRepositoryI } from "../domain/ClickTrackingRepository";
import { fail, success, type EmptyResult } from "~/packages/result";
import { InfrastructureError } from "~/packages/result/infrastructure-error";

export class ClicksTrackingRepoAPI implements ClickTrackingRepositoryI {
  constructor(private baseUrl: string) {}

  public async store(
    params: {
      userId: number | null;
      fingerprintValue: string;
      path: string;
    },
    queryParams: URLSearchParams,
  ): Promise<EmptyResult<InfrastructureError>> {
    return fetch(`${this.baseUrl}/sessions?${queryParams.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: params.userId,
        fingerprint_value: params.fingerprintValue,
        path: params.path,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        const response = await res.json();
        throw response;
      }
      return success();
    })
      .catch(error => fail(InfrastructureError.newFromUnknownError({ inputs: { params, queryParams } }, error)));
  }

  public async update(
    params: {
      userId: number;
      fingerprintValue: string;
    },
  ): Promise<EmptyResult<InfrastructureError>> {
    return fetch(`${this.baseUrl}/sessions`, {
      method: "PUT",
      body: JSON.stringify({
        user_id: params.userId,
        fingerprint_value: params.fingerprintValue,
      }),
    }).then(() => success())
      .catch(error => fail(InfrastructureError.newFromUnknownError({ inputs: { params } }, error)));
  }
}
