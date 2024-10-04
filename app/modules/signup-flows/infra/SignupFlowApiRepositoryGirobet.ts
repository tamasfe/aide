import { SignupFlow } from "../domain/SignupFlow";
import type { SignupFlowApiRepositoryI } from "../domain/SignupFlowApiRepositoryI";
import { SignupFlowNotFound } from "../domain/SignupFlowNotFound";
import { InfrastructureError } from "~/packages/result/infrastructure-error";
import { fail, success, unfold, type EmptyResult } from "~/packages/result";
import { createBackendOpenApiClient } from "~/packages/http-client/create-backend-open-api-client";
import { HttpBackendApiError } from "~/packages/http-client/http-client-error";

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
      const httpError = HttpBackendApiError.newFromBackendError(error, response);
      if (httpError.status === 404) {
        return fail(SignupFlowNotFound.newFromId(id));
      }
      return fail(InfrastructureError.newFromError({ signupFlowId: id }, httpError));
    }

    if (data) {
      return success(unfold(SignupFlow.newFromProps({
        id,
        email: (data.fields.email || null) as string | null,
        password: (data.fields.password || null) as string | null,
        cpf: (data.fields.cpf || null) as string | null,
        telephone: (data.fields.telephone || null) as string | null,
      },
      )));
    }

    if (data === null) {
      return fail(SignupFlowNotFound.newFromId(id));
    }

    throw new Error("Unexpected scenario: library did not return data nor error. This should never happen. Response: " + JSON.stringify(response));
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

    throw new Error("Unexpected scenario: library did not return data nor error. This should never happen. Response: " + JSON.stringify(response));
  }

  public async submit(signupFlowId: string): Promise<EmptyResult<InfrastructureError>> {
    const { data, error, response } = await this.apiClient.POST("/signup/flow/{flow_id}", {
      params: {
        path: {
          flow_id: signupFlowId,
        },
      },
    });

    if (error) {
      const httpError = HttpBackendApiError.newFromBackendError(error, response);
      return fail(InfrastructureError.newFromError({ signupFlowId }, httpError));
    }

    if (data) {
      return success();
    }

    throw new Error("Unexpected scenario: library did not return data nor error. This should never happen. Response: " + JSON.stringify(response));
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
      requestBody.phone = signupFlow.telephone;
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

    if (data) {
      return success();
    }

    throw new Error("Unexpected scenario: library did not return data nor error. This should never happen. Response: " + JSON.stringify(response));
  }

  constructor(apiBaseUrl: string, userJurisdiction: string | undefined) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (userJurisdiction) {
      headers["CF-IPCountry"] = userJurisdiction;
    }

    this.apiClient = createBackendOpenApiClient(apiBaseUrl, headers);
  }

  private apiClient: ReturnType<typeof createBackendOpenApiClient>;
}
