import type { NuxtApp } from "#app";
import { success, type EmptySuccessResult } from "~/packages/result";

export class EmitCommandCloseUserActionModal {
  constructor(private readonly nuxtApp: NuxtApp) {

  }

  public async handle(): Promise<EmptySuccessResult> {
    await this.nuxtApp.callHook("frontend:commands:modals:close-user-interaction-modal");
    return success();
  }
}
