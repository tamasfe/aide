import type { DeleteCurrentSignupFlowId } from "../../application/DeleteCurrentSignupFlowId";
import type { LoggerI } from "~/packages/logger/Logger";

export class DeleteCurrentSignupFlowIdOnSignupFlowSubmitted {
  constructor(
    private command: DeleteCurrentSignupFlowId,
    private logger: LoggerI,
  ) {}

  public async handle() {
    const result = await this.command.handle();
    if (result.isFailure) {
      this.logger.error("Unexpected error while deleting the current signup flow id on signup flow submitted", result.error);
    }
    return null;
  }
}
