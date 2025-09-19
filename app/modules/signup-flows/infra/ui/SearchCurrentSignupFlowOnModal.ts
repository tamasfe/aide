import type { SearchCurrentSignupFlow } from "../../application/SearchCurrentSignupFlow";
import type { LoggerI } from "~/packages/logger/Logger";

export class SearchCurrentSignupFlowOnModalInit {
  constructor(
    private query: SearchCurrentSignupFlow,
    private logger: LoggerI,
  ) {}

  public async handle() {
    const flowResult = await this.query.handle();
    if (flowResult.isFailure) {
      this.logger.error("Unexpected error while searching the current signup flow on the register modal", flowResult.error);
      return null;
    }
    return flowResult.value;
  }
}
