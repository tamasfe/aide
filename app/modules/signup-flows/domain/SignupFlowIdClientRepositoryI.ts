import type { ErrorRetrievingSignupFlowId } from "./errors/ErrorRetrievingSignupFlowId";
import type { ErrorSavingSignupFlowId } from "./errors/ErrorSavingSignupFlowId";
import type { EmptyResult, Result } from "~/packages/result";

export interface SignupFlowIdClientRepositoryI {
  searchCurrent(): Promise<Result<string | null, ErrorRetrievingSignupFlowId>>;
  saveCurrent(flowId: string): Promise<EmptyResult<ErrorSavingSignupFlowId>>;
}
