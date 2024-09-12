import type { CustomError, Result } from "~/packages/result";

export interface SignupFlowIdClientRepositoryI {
  searchCurrentFlowId(): Promise<Result<string | null, CustomError>>;
}
