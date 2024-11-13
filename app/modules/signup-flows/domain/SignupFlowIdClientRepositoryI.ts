import type { ErrorRetrievingSignupFlowId } from "./errors/ErrorRetrievingSignupFlowId";
import type { ErrorSavingSignupFlowId } from "./errors/ErrorSavingSignupFlowId";
import type { SignupFlowIdNotFound } from "./errors/SignupFlowIdNotFound";
import type { ErrorDeletingSignupFlowId } from "./errors/ErrorDeletingSignupFlowId";
import type { EmptyResult, Result } from "~/packages/result";

export interface SignupFlowIdClientRepositoryI {
  searchCurrent(): Promise<Result<string | null, ErrorRetrievingSignupFlowId>>;
  findCurrent(): Promise<Result<string, SignupFlowIdNotFound | ErrorRetrievingSignupFlowId>>;
  deleteCurrent(): Promise<EmptyResult<ErrorDeletingSignupFlowId>>;
  saveCurrent(flowId: string): Promise<EmptyResult<ErrorSavingSignupFlowId>>;
}
