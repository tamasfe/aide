import type { CustomError, EmptyResult, FailureResult, Result } from "../result";
import type { InfrastructureError } from "../result/infrastructure-error";

export interface MutexI {
  execute<T extends Result<unknown, CustomError> | EmptyResult<CustomError>>(lockName: string, fn: () => Promise<T>): Promise<T | FailureResult<InfrastructureError>>;
}
