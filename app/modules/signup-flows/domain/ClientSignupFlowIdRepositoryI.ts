import type { CustomError, Result } from "~/packages/result";

export interface ClientSignupFlowIdRepositoryI {
  searchCurrentFlowId(): Promise<Result<string | null, CustomError>>;
}
