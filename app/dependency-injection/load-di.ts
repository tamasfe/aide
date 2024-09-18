import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { EmitteryAsyncMessagePublisher } from "~/packages/async-messages/emittery-async-message-publisher";

export interface CommonDependenciesI {
  asyncMessagePublisher: AsyncMessagePublisherI;
}

export async function loadDependencies(): Promise<CommonDependenciesI> {
  return {
    asyncMessagePublisher: new EmitteryAsyncMessagePublisher(),
  };
}
