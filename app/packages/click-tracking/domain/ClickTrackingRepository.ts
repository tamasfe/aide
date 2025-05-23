import type { ExceptionGettingUserFingerprint } from "./ExceptionGettingUserFingerprint";
import type { EmptyResult } from "~/packages/result";
import type { InfrastructureError } from "~/packages/result/infrastructure-error";

export interface ClickTrackingRepositoryI {
  store(
    params: {
      userId: number | null;
      fingerprintValue: string;
      path: string;
    },
    queryParams: URLSearchParams,
  ): Promise<EmptyResult<ExceptionGettingUserFingerprint | InfrastructureError>>;

  update(
    params: {
      userId: number;
      fingerprintValue: string;
    },
  ): Promise<EmptyResult<ExceptionGettingUserFingerprint | InfrastructureError>>;
}
