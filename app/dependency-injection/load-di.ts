import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";
import { EmitteryAsyncMessagePublisher } from "~/packages/async-messages/emittery-async-message-publisher";

export interface DependenciesI {
  asyncMessagePublisher: AsyncMessagePublisherI;
}

export async function loadDependencies(): Promise<DependenciesI> {
  return {
    asyncMessagePublisher: new EmitteryAsyncMessagePublisher(),
  };
}
