import { SignupFlow } from "../domain/SignupFlow";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import { SignupFlowNotFound } from "../domain/SignupFlowNotFound";
import { ErrorAlreadyTakenCpf } from "../domain/errors/ErrorAlreadyTakenCpf";
import { ErrorAlreadyTakenTelephone } from "../domain/errors/ErrorAlreadyTakenTelephone";
import { ErrorAlreadyTakenEmail } from "../domain/errors/ErrorAlreadyTakenEmail";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { fail, success, unfold, type EmptyResult } from "~/packages/result";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";
import type { AsyncMessagePublisherI } from "~/packages/async-messages/async-message-publisher";

export class SignupFlowApiRepositoryGirobet implements SignupFlowApiRepositoryI {
  public async getById(
    id: string,
  ) {
    const { data, error, response } = await this.apiClient.GET("/signup/flow/{flow_id}", {
      params: {
        path: {
          flow_id: id,
        },
      },
    });

    if (error) {
      if (error.code === "SIGNUP_FLOW_NOT_FOUND") {
        return fail(SignupFlowNotFound.newFromId(id));
      }
      const httpError = HttpBackendApiError.newFromBackendError(error, response);
      return fail(InfrastructureError.newFromError({ signupFlowId: id }, httpError));
    }

    if (data) {
      return success(unfold(SignupFlow.newFromProps({
        id,
        email: (data.fields.email || null) as string | null,
        password: (data.fields.password || null) as string | null,
        cpf: (data.fields.CPF || null) as string | null,
        telephone: (data.fields.phone || null) as string | null,
        locale: (data.fields.language || null) as string | null,
        timeZone: (data.fields.time_zone || null) as string | null,
      },
      )));
    }

    if (data === null) {
      return fail(SignupFlowNotFound.newFromId(id));
    }

    return fail(InfrastructureError.newFromError({ data, error, response }, new Error("Unexpected scenario: library did not return data nor error. This should never happen. Response: ")));
  }

  public async create() {
    const { data, error, response } = await this.apiClient.GET("/signup/flow", {});

    if (error) {
      const httpError = HttpBackendApiError.newFromBackendError(error, response);
      return fail(InfrastructureError.newFromError({}, httpError));
    }

    if (data) {
      return success(data.flow_id);
    }

    return fail(InfrastructureError.newFromError({ data, error, response }, new Error("Unexpected scenario: library did not return data nor error. This should never happen. Response: ")));
  }

  public async submit(signupFlowId: string): Promise<EmptyResult<InfrastructureError | ErrorAlreadyTakenCpf | ErrorAlreadyTakenTelephone | ErrorAlreadyTakenEmail>> {
    const { data, error, response } = await this.apiClient.POST("/signup/flow/{flow_id}", {
      params: {
        path: {
          flow_id: signupFlowId,
        },
      },
    });

    if (error) {
      if (error.code === "VALIDATION") {
        for (const [field, errors] of Object.entries(error.metadata)) {
          if (Array.isArray(errors)) {
            for (const validationError of errors) {
              if (validationError.code === "taken") {
                switch (field) {
                  case "CPF":
                    return fail(new ErrorAlreadyTakenCpf({ signupFlowId, validationError }));

                  case "email":
                    return fail(new ErrorAlreadyTakenEmail({ signupFlowId, validationError }));

                  case "telephone":
                    return fail(new ErrorAlreadyTakenTelephone({ signupFlowId, validationError }));
                }
              }
            }
            continue;
          }
        }
      }

      const httpError = HttpBackendApiError.newFromBackendError(error, response);
      return fail(InfrastructureError.newFromError({ signupFlowId }, httpError));
    }

    if (data || response.ok) {
      return success();
    }

    return fail(InfrastructureError.newFromError({ data, error, response, signupFlowId }, new Error("Unexpected scenario: library did not return data nor error. This should never happen. Response: ")));
  }

  public async update(
    signupFlow: SignupFlow,
  ) {
    const requestBody: Record<string, string> = {};
    if (signupFlow.email !== null) {
      requestBody.email = signupFlow.email.value;
    }
    if (signupFlow.password !== null) {
      requestBody.password = signupFlow.password.value;
    }
    if (signupFlow.cpf !== null) {
      requestBody.CPF = signupFlow.cpf.value;
    }
    if (signupFlow.telephone !== null) {
      requestBody.phone = signupFlow.telephone.value;
    }
    if (signupFlow.timeZone !== null) {
      requestBody.time_zone = signupFlow.timeZone;
    }
    if (signupFlow.locale !== null) {
      requestBody.language = signupFlow.locale;
    }
    const { data, error, response } = await this.apiClient.PATCH("/signup/flow/{flow_id}", {
      params: {
        path: {
          flow_id: signupFlow.id,
        },
      },
      body: requestBody,
    });

    if (error) {
      const httpError = HttpBackendApiError.newFromBackendError(error, response);
      return fail(InfrastructureError.newFromError({ signupFlow }, httpError));
    }

    if (data || response.ok) {
      return success();
    }

    return fail(InfrastructureError.newFromError({ data, error, response }, new Error("Unexpected scenario: library did not return data nor error. This should never happen. Response: ")));
  }

  constructor(clientOptions: { baseUrl: string; headers?: Record<string, string>; userJurisdiction?: string }, asyncMessagePublisher: AsyncMessagePublisherI) {
    this.apiClient = createBackendOpenApiClient(clientOptions, asyncMessagePublisher);
  }

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
